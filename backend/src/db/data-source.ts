import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';

const isProd = process.env.NODE_ENV === 'production';
const sslMode = process.env.DB_SSL;

const extra =
  sslMode === 'required'
    ? { ssl: { rejectUnauthorized: true } }
    : sslMode === 'skip-verify'
    ? { ssl: { rejectUnauthorized: false } }
    : undefined;

export const dataSourceOptions = process.env.DATABASE_URL
  ? {
      type: 'mysql' as const,
      url: process.env.DATABASE_URL, 
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/db/migrations/*.js'],
      synchronize: false,
      extra,
    }
  : {
      type: 'mysql' as const,
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
      entities: [isProd ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
      migrations: [isProd ? 'dist/db/migrations/*.js' : 'src/db/migrations/*.ts'],
      synchronize: false,
      extra,
    };

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
