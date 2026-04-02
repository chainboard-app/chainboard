import { DataSourceOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Tip } from '../entities/tip.entity';

export const testDatabaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'chainboard',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'chainboard_test',
  entities: [User, Post, Tip],
  synchronize: true,
  dropSchema: true,
};
