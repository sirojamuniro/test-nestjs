import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Booking } from '../booking/entities/booking.entity';
import { Customer } from '../customer/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Booking, Customer])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
