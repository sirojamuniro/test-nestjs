// src/modules/customer/customer.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ApiResponse } from '../../common/dto/api-response.dto';
import { Customer } from './entities/customer.entity';
import { PageDto } from '../../common/dto/page.dto';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<ApiResponse<Customer>> {
    const customer = await this.customerService.create(createCustomerDto);
    return new ApiResponse(customer, 'Customer created successfully');
  }

  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,  
    @Query('take', ParseIntPipe) take: number = 10,  
    @Query('search') search?: string, 
  ): Promise<ApiResponse<PageDto<Customer>>> {
    const pageOptionsDto = new PageOptionsDto();
    pageOptionsDto.page = page;
    pageOptionsDto.take = take;
    pageOptionsDto.search = search;

    const customers = await this.customerService.findAll(pageOptionsDto);
    return new ApiResponse(customers, 'Customers retrieved successfully');
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Customer>> {
    const customer = await this.customerService.findOne(id);
    return new ApiResponse(customer, 'Customer retrieved successfully');
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<ApiResponse<Customer>> {
    const customer = await this.customerService.update(id, updateCustomerDto);
    return new ApiResponse(customer, 'Customer updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<null>> {
    await this.customerService.remove(id);
    return new ApiResponse(null, 'Customer removed successfully');
  }
}
