import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import dotenv from 'dotenv';
dotenv.config({ override: true });

const DB_SSL = (process.env.DB_SSL ?? 'false').toLowerCase();

const sslOption =
  DB_SSL === 'true' || DB_SSL === 'require'
    ? { rejectUnauthorized: false }
    : undefined;

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  url: process.env.DATABASE_URL ?? '',
  entities: [join(__dirname, '..', '**/*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations/*.{ts,js}')],
  synchronize: false,
  ssl: sslOption,        
};

export default new DataSource(dataSourceOptions);
