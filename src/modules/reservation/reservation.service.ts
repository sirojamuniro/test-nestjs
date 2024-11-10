import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import * as nodemailer from 'nodemailer';
import { Booking } from '../booking/entities/booking.entity';
@Injectable()
export class ReservationService {
  private readonly openingTime = 10; // Restaurant opens at 10 AM
  private readonly closingTime = 22; // Restaurant closes at 10 PM

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly connection: Connection,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const { tableId, reservationTime, customerId } = createReservationDto;
    const reservationDate = new Date(reservationTime);

    // Check if reservation time is within restaurant hours
    const hour = reservationDate.getUTCHours();
    if (hour < this.openingTime || hour >= this.closingTime) {
      throw new ConflictException(
        `Reservations can only be made between ${this.openingTime}:00 and ${this.closingTime}:00`,
      );
    }

    return await this.connection.transaction(async (manager) => {
      // Pessimistic locking on table to prevent double-booking
      const table = await manager
        .getRepository(Booking)
        .findOne(tableId, { lock: { mode: 'pessimistic_write' } });

      if (!table) {
        throw new NotFoundException('Table not found');
      }

      // Check for conflicting reservations at the requested time
      const conflictingReservation = await manager
        .getRepository(Reservation)
        .createQueryBuilder('reservation')
        .where('reservation.tableId = :tableId', { tableId })
        .andWhere('reservation.reservationTime = :reservationTime', { reservationTime })
        .getOne();

      if (conflictingReservation) {
        throw new ConflictException('Table is already booked for the requested time');
      }

      // Create reservation
      const reservation = this.reservationRepository.create({
        ...createReservationDto,
        table,
        customerId,
      });

      const savedReservation = await manager.save(reservation);

      // Send confirmation email
      await this.sendConfirmationEmail(customerId);

      return savedReservation;
    });
  }

  async findAll() {
    return await this.reservationRepository.find({ relations: ['table', 'customer'] });
  }

  async findOne(id: number) {
    const reservation = await this.reservationRepository.findOne(id, { relations: ['table', 'customer'] });
    if (!reservation) throw new NotFoundException(`Reservation with id ${id} not found`);
    return reservation;
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    const reservation = await this.findOne(id);
    Object.assign(reservation, updateReservationDto);
    return await this.reservationRepository.save(reservation);
  }

  async remove(id: number) {
    const reservation = await this.findOne(id);
    return await this.reservationRepository.remove(reservation);
  }

  private async sendConfirmationEmail(customerId: string) {
    // Configure transporter (example configuration; use environment variables in real applications)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    // Send email
    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: 'customer@example.com', // Replace with the actual customer's email
      subject: 'Reservation Confirmation',
      text: 'Your reservation has been successfully created. Thank you!',
    });
  }
}
