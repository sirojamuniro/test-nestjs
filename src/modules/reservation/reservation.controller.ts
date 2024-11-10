import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiResponse } from '../../common/dto/api-response.dto';
import { Reservation } from './entities/reservation.entity';
import { PageDto } from '../../common/dto/page.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto): Promise<ApiResponse<Reservation>> {
    const reservation = await this.reservationService.create(createReservationDto);
    return new ApiResponse(reservation, 'Reservation created successfully');
  }

  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,  
    @Query('take', ParseIntPipe) take: number = 10,  
  ): Promise<ApiResponse<PageDto<Reservation>>> {
    const pageOptionsDto = new PageOptionsDto();
    pageOptionsDto.page = page;
    pageOptionsDto.take = take;

    const reservations = await this.reservationService.findAll(pageOptionsDto);
    return new ApiResponse(reservations, 'Reservations retrieved successfully');
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Reservation>> {
    const reservation = await this.reservationService.findOne(+id);
    return new ApiResponse(reservation, 'Reservation retrieved successfully');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<ApiResponse<Reservation>> {
    const reservation = await this.reservationService.update(+id, updateReservationDto);
    return new ApiResponse(reservation, 'Reservation updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<null>> {
    await this.reservationService.remove(+id);
    return new ApiResponse(null, 'Reservation removed successfully');
  }
}
