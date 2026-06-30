import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Chain } from '../../common/types';
import { Post } from '../../posts/entities/post.entity';

export enum GatingType {
  TOKEN = 'token',
  NFT = 'nft',
}

@Entity('communities')
export class Community {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column()
  chain: Chain;

  @Column({ type: 'varchar' })
  gatingType: GatingType;

  @Column()
  contractAddress: string;

  @Column({ type: 'decimal', precision: 20, scale: 0, default: 1 })
  minBalance: string;

  @Column({ default: 0 })
  memberCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Post, (post) => post.community)
  posts: Post[];
}
