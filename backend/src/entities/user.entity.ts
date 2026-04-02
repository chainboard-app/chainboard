import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from './post.entity.js';
import { Tip } from './tip.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  githubId: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  walletAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Tip, (tip) => tip.sender)
  sentTips: Tip[];

  @OneToMany(() => Tip, (tip) => tip.receiver)
  receivedTips: Tip[];
}
