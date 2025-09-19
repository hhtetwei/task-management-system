import dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  url: process.env.DATABASE_URL ?? '',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: ['local', 'testing'].includes(process.env.NODE_ENV ?? ''),
  ssl: {
    rejectUnauthorized: ![
      'local',
      'testing',
      'development',
      'staging',
    ].includes(process.env.NODE_ENV ?? ''),
  },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
