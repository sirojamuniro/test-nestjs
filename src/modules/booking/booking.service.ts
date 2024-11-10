import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { PageMetaDto } from '../../common/dto/page-meta.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  // Create a new booking
  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const booking = this.bookingRepository.create(createBookingDto);
    return await this.bookingRepository.save(booking);
  }

  // Return paginated list of bookings
  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Booking>> {
    const { page, take, search } = pageOptionsDto;

    // Calculate skip based on the page and take
    const skip = (page - 1) * take;

    // Apply search if provided
    const where = search
      ? { name: ILike(`%${search}%`) } // Replace 'name' with the appropriate field for bookings
      : {};

    // Fetch the bookings with pagination and search
    const [bookings, itemCount] = await this.bookingRepository.findAndCount({
      where,
      skip,
      take,
    });

    // Create page metadata
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    // Return the paginated response
    return new PageDto(bookings, pageMetaDto);
  }

  // Find a booking by ID
  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: {
        reservations: true,
      }, // Adjust as needed for relations
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  // Update an existing booking
  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);
    Object.assign(booking, updateBookingDto);
    return await this.bookingRepository.save(booking);
  }

  // Remove a booking
  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingRepository.remove(booking);
  }
}
