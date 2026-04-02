import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './entities/user.entity.js';
import { Post } from './entities/post.entity.js';
import { Tip } from './entities/tip.entity.js';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'chainboard',
  entities: [User, Post, Tip],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
