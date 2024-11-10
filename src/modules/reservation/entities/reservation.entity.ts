import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn} from 'typeorm';

import { Customer } from "../../customer/entities/customer.entity";
import { Booking } from "../../booking/entities/booking.entity";
@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Index()
  @ManyToOne(() => Customer, (customer) => customer.reservations)
  @JoinColumn()
  customer: Customer | string;
  
  @Index()
  @ManyToOne(() => Booking, (booking) => booking.reservations)
  @JoinColumn()
  table: Booking | string;
  
  @Column('timestamp')
  startTime: Date;
  
  @Column('timestamp')
  endTime: Date;
}