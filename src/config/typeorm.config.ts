// src/config/typeorm.config.ts

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'template',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../**/*.migration{.ts,.js}'],
  subscribers: [__dirname + '/../**/*.subscribers{.ts,.js}'],
  migrationsTableName: 'migrations',
  logging: process.env.DB_LOG === 'true',
  synchronize: process.env.DB_SYNC === 'true',
  poolSize: Number(process.env.DB_POOL_SIZE) || 3,
};
