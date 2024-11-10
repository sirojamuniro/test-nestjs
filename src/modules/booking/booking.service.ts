import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingTableRepository: Repository<Booking>,
  ) {}
  async create(createTableDto: CreateBookingDto): Promise<Booking> {
    const table = this.bookingTableRepository.create(createTableDto);
    return this.bookingTableRepository.save(table);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingTableRepository.find();
  }

  async findOne(id: string): Promise<Booking> {
    const customer = await this.bookingTableRepository.findOne({ where: { id },   relations: {
      tables: true,
    } });
    if (!customer) throw new NotFoundException(`Booking with ID ${id} not found`);
    return customer;
  }

  async update(id: string, updateTableDto: UpdateBookingDto): Promise<Booking> {
    const table = await this.findOne(id);
    Object.assign(table, updateTableDto);
    return this.bookingTableRepository.save(table);
  }

  async remove(id: string): Promise<void> {
    const table = await this.findOne(id);
    await this.bookingTableRepository.remove(table);
  }
}
