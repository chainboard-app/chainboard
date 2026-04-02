import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity.js';
import { Post } from './post.entity.js';

@Entity('tips')
export class Tip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal')
  amount: number;

  @Column()
  senderId: string;

  @ManyToOne(() => User, (user) => user.sentTips, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column()
  receiverId: string;

  @ManyToOne(() => User, (user) => user.receivedTips, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @Column()
  postId: string;

  @ManyToOne(() => Post, (post) => post.tips, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  txHash: string;

  @CreateDateColumn()
  createdAt: Date;
}
