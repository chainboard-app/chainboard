import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Tip } from './entities/tip.entity';
import { InitialSchema1712000000000 } from './migrations/1712000000000-InitialSchema';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'chainboard',
  entities: [User, Post, Tip],
  migrations: [InitialSchema1712000000000],
  synchronize: false,
});
