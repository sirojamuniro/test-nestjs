import { PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';
import { IsUUID } from 'class-validator';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
    @IsUUID()
    id: string;
}
