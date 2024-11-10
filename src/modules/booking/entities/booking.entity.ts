
import { Reservation } from 'src/modules/reservation/entities/reservation.entity';
import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany, } from 'typeorm';

@Entity()
export class Booking {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column()
    name: string;
    
    @Column()
    capacity: number;

    @OneToMany(() => Reservation, reservations => reservations.table)
    tables: Reservation[];
}
