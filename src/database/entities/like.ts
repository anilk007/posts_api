// src/entities/like.entity.ts
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Post } from './post';
import { User } from './user';

@Entity('likes')
@Index('idx_likes_wallet_address', ['wallet_address'])
@Index('idx_likes_created_at', ['created_at'])
export class Like {
  @PrimaryColumn() // Part of composite primary key
  post_id: number;

  @PrimaryColumn({ length: 42 }) // Part of composite primary key, VARCHAR(42)
  wallet_address: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' }) // TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  created_at: Date;

  // Define relationships
  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wallet_address', referencedColumnName: 'wallet_address' })
  user: User;
}
