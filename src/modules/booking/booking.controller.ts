import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ApiResponse } from '../../common/dto/api-response.dto';
import { Booking } from './entities/booking.entity';
import { PageDto } from '../../common/dto/page.dto';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Create a new booking
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto): Promise<ApiResponse<Booking>> {
    const booking = await this.bookingService.create(createBookingDto);
    return new ApiResponse(booking, 'Booking created successfully');
  }

  // Get all bookings with pagination
  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,  
    @Query('take', ParseIntPipe) take: number = 10,  
    @Query('search') search?: string,
  ): Promise<ApiResponse<PageDto<Booking>>> {
    const pageOptionsDto = new PageOptionsDto();
    pageOptionsDto.page = page;
    pageOptionsDto.take = take;
    pageOptionsDto.search = search;

    const bookings = await this.bookingService.findAll(pageOptionsDto);
    return new ApiResponse(bookings, 'Bookings retrieved successfully');
  }

  // Get a booking by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Booking>> {
    const booking = await this.bookingService.findOne(id);
    return new ApiResponse(booking, 'Booking retrieved successfully');
  }

  // Update an existing booking
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<ApiResponse<Booking>> {
    const booking = await this.bookingService.update(id, updateBookingDto);
    return new ApiResponse(booking, 'Booking updated successfully');
  }

  // Remove a booking
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<null>> {
    await this.bookingService.remove(id);
    return new ApiResponse(null, 'Booking removed successfully');
  }
}
