import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, LessThanOrEqual, MoreThanOrEqual, ILike } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { Booking } from '../booking/entities/booking.entity';
import { Customer } from '../customer/entities/customer.entity';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { MailHelper } from '../../common/helpers/mail.helper';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class ReservationService {
  private readonly openingTime = 10; // Restaurant opens at 10 AM
  private readonly closingTime = 22; // Restaurant closes at 10 PM

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly connection: Connection,
  ) {}

  // Create a reservation
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
  
    // Check if the table exists in the Booking relation
    const table = await this.bookingRepository.findOne({ where: { id: tableId } });
    if (!table) {
      throw new NotFoundException(`Table with ID ${tableId} not found`);
    }
  
    // Fetch the Customer object based on customerId (if needed)
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }
  
    // Perform the reservation creation inside a transaction
    return await this.connection.transaction(async (manager) => {
      // Pessimistic locking on table to prevent double-booking
      const lockedTable = await manager
        .getRepository(Booking)
        .findOne({ where: { id: tableId }, lock: { mode: 'pessimistic_write' } });
  
      if (!lockedTable) {
        throw new NotFoundException('Table not found or is already locked');
      }
  
      // Check for conflicting reservations
      const conflictingReservation = await this.findConflictingReservation(
        tableId,
        reservationDate,
      );
  
      if (conflictingReservation) {
        throw new ConflictException('Table is already booked for the requested time');
      }
  
      // Create and save the reservation
      const reservation = this.reservationRepository.create({
        ...createReservationDto,
        table,
        customer,
      });
      const savedReservation = await this.reservationRepository.save(reservation);
  
      // Send confirmation email (optional)
      await this.sendConfirmationEmail(customer.email, customer.name, {
        date: reservationDate.toDateString(),
        time: reservationDate.toLocaleTimeString(),
        table: table.name,
      });
  
      return savedReservation;
    });
  }

  // Get all reservations with pagination
  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Reservation>> {
    const { page, take } = pageOptionsDto;
    const skip = (page - 1) * take;
  

  
    const [reservations, itemCount] = await this.reservationRepository.findAndCount({

      skip,
      take,
      relations: ['table', 'customer'],
    });
  
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
  
    return new PageDto(reservations, pageMetaDto);
  }

  // Find a reservation by ID
  async findOne(id: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id }, 
      relations: {
        table: true,
        customer: true,
      },
    });
    if (!reservation) throw new NotFoundException(`Reservation with ID ${id} not found`);
    return reservation;
  }

  // Update a reservation
  async update(id: number, updateReservationDto: UpdateReservationDto) {
    const reservation = await this.findOne(id);
    Object.assign(reservation, updateReservationDto);
    return await this.reservationRepository.save(reservation);
  }

  // Remove a reservation
  async remove(id: number) {
    const reservation = await this.findOne(id);
    return await this.reservationRepository.remove(reservation);
  }

  // Method to check for conflicting reservations based on start and end times
  private async findConflictingReservation(
    tableId: string,
    reservationTime: Date,
  ): Promise<Reservation | undefined> {
    const endTime = new Date(reservationTime);
    endTime.setHours(reservationTime.getHours() + 2); // Assuming 2-hour booking duration

    return await this.reservationRepository.findOne({
      where: {
        table: { id: tableId },
        startTime: LessThanOrEqual(endTime),
        endTime: MoreThanOrEqual(reservationTime),
      },
    });
  }

  // Method to send a confirmation email
  private async sendConfirmationEmail(customerEmail: string, customerName: string, reservationDetails: { date: string; time: string; table: string; }) {
    const htmlTemplate = fs.readFileSync(path.resolve(__dirname, '../../common/templates/reservation-confirmation.template.html'), 'utf-8');
    const htmlContent = this.replaceTemplatePlaceholders(htmlTemplate, {
      customerName,
      reservationDate: reservationDetails.date,
      reservationTime: reservationDetails.time,
      tableNumber: reservationDetails.table,
    });

    await MailHelper.sendMail(
      customerEmail,
      'Reservation Confirmation',
      'Your reservation has been successfully created. Thank you!',
      htmlContent
    );
  }

  private replaceTemplatePlaceholders(template: string, placeholders: Record<string, string>): string {
    return Object.entries(placeholders).reduce((acc, [key, value]) => acc.replace(`{{${key}}}`, value), template);
  }
}
