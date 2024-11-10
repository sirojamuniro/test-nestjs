// src/modules/customer/customer.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository , ILike} from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { PageMetaDto } from '../../common/dto/page-meta.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // Create a new customer
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(customer);
  }

  // Return paginated list of customers
  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Customer>> {
    const { page, take, search } = pageOptionsDto;

    // Calculate skip based on the page and take
    const skip = (page - 1) * take;

    // Apply search if provided
    const where = search
      ? { name: ILike(`%${search}%`) }
      : {};

    // Fetch the customers with pagination and search
    const [customers, itemCount] = await this.customerRepository.findAndCount({
      where,
      skip,
      take,
    });

    // Create page metadata
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    
    // Return the paginated response
    return new PageDto(customers, pageMetaDto);
  }

  // Find a customer by ID, including relations
  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['reservations'],
    });
    if (!customer) throw new NotFoundException(`Customer with ID ${id} not found`);
    return customer;
  }

  // Update an existing customer
  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    Object.assign(customer, updateCustomerDto);
    return await this.customerRepository.save(customer);
  }

  // Remove a customer
  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }
}
