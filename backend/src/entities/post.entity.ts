import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar' })
  chainTag: string;

  @Column({ type: 'int', default: 0 })
  upvotes: number;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @CreateDateColumn()
  createdAt: Date;
}
