import { IsInt, IsString, Min } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateBookingDto {
  
  @ApiProperty({
    description: "Name of the booking",
    example: "Family Dinner Reservation",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Capacity for the booking",
    example: 4,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  capacity: number;
}
