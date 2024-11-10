import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { CustomerModule } from './modules/customer/customer.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { BookingModule } from './modules/booking/booking.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
        ttl: 60000, //1 minute
        limit: 10,
      }]),  
      TypeOrmModule.forRoot(typeOrmConfig), 
      CustomerModule, 
      ReservationModule, 
      BookingModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
