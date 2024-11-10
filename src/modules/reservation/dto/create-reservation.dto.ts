import { IsDate, IsInt, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @ApiProperty({
    description: "Unique identifier for the customer making the reservation",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  customerId: string;

  @ApiProperty({
    description: "Unique identifier for the table being reserved",
    example: "123e4567-e89b-12d3-a456-426614174001",
  })
  @IsUUID()
  tableId: string;

  @ApiProperty({
    description: "Date and time for the reservation",
    example: "2024-11-15T19:00:00.000Z",
  })
  @IsDate()
  @Type(() => Date)
  reservationTime: Date;

  @ApiProperty({
    description: "Number of guests for the reservation",
    example: 4,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  numberOfGuests: number;
}