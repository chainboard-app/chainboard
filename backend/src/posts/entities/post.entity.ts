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

  @ManyToOne(() => Community, (community) => community.posts, {
    nullable: true,
  })
  @JoinColumn({ name: 'communityId' })
  community?: Community;

  @Column({ nullable: true })
  communityId?: string;
}
