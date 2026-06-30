import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  Chain,
  WalletAddress,
  NotificationType,
  NotificationDelivery,
} from '../../common/types';
import { Post } from '../../posts/entities/post.entity';
import { Tip } from '../../tips/entities/tip.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  displayName: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true, type: 'text' })
  bio?: string;

  @Column({ type: 'jsonb' })
  walletAddresses: WalletAddress[];

  @Column({ nullable: true })
  githubUsername?: string;

  @CreateDateColumn()
  joinedAt: Date;

  @Column({ default: 0 })
  followersCount: number;

  @Column({ default: 0 })
  followingCount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalTipsReceived: number;

  @Column({ default: 0 })
  totalUpvotes: number;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'jsonb', default: {} })
  notificationPreferences: Record<NotificationType, NotificationDelivery>;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Tip, (tip) => tip.sender)
  tipsSent: Tip[];

  @OneToMany(() => Tip, (tip) => tip.receiver)
  tipsReceived: Tip[];
}
