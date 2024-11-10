
import { Reservation } from 'src/modules/reservation/entities/reservation.entity';
import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany, } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  
  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  email: string;
  
  @Index({ unique: true })
  @Column()
  phone: string;

  @OneToMany(() => Reservation, reservations => reservations.customer)
  reservations: Reservation[];
}
