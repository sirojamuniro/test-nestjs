import { IsEmail, IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateCustomerDto {
    @ApiProperty({
        description: "The customer's full name",
        example: "John Doe",
      })
      @IsNotEmpty()
      @IsString()
      name: string;
    
      @ApiProperty({
        description: "The customer's email address",
        example: "johndoe@example.com",
      })
      @IsNotEmpty()
      @IsEmail()
      email: string;
    
      @ApiProperty({
        description: "The customer's phone number",
        example: "+6289617017337",
      })
      @IsNotEmpty()
      @IsString()
      @IsPhoneNumber()
      phone: string;
}