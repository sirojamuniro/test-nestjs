import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, IsString } from 'class-validator';

export class PageOptionsDto {
  @ApiPropertyOptional({
    description: 'The page number to retrieve',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Maximum number of items to retrieve',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  take: number = 10;

  @ApiPropertyOptional({
    description: 'Search term to filter customers',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
