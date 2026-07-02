import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import type { Chain } from '../../common/types';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';

export interface Mention {
  userId: string;
  username: string;
  startIndex: number;
  endIndex: number;
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;

  @Column('text')
  content: string;

  @Column({ type: 'varchar' })
  chainTag: Chain;

  @Column({ type: 'tsvector', nullable: true })
  @Index({ type: 'gin' })
  searchVector?: any;

  @Column({ type: 'jsonb', default: [] })
  mentions: Mention[];

  @Column({ type: 'jsonb', default: [] })
  attachments: string[]; // array of image URLs

  @Column({ default: 0 })
  upvotes: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  tipsReceived: number;

  @Column({ default: 0 })
  commentsCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'active' })
  status: 'active' | 'deleted';

  @Column({ default: false })
  isPinned: boolean;

  @Column({ type: 'timestamp', nullable: true })
  pinnedAt: Date | null;

  @ManyToOne(() => Community, (community) => community.posts, {
    nullable: true,
  })
  @JoinColumn({ name: 'communityId' })
  community?: Community;

  @Column({ nullable: true })
  communityId?: string;
}
