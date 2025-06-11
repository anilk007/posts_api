// src/entities/post.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { User } from './user';
import { Like } from './like';
import { Comment } from './comment';

@Entity('posts')
@Index('idx_posts_wallet_address', ['wallet_address'])
@Index('idx_posts_timestamp', ['timestamp'])
// Note: For 'idx_posts_content_trgm' with gin_trgm_ops, TypeORM doesn't directly support it via @Index.
// You would typically add this index directly in your migration or raw SQL.
export class Post {
  @PrimaryGeneratedColumn() // SERIAL PRIMARY KEY
  id: number;

  @Column({ length: 42 }) // VARCHAR(42)
  wallet_address: string;

  @Column({ type: 'text' }) // TEXT
  content: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' }) // TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  timestamp: Date;

  // Define relationships
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'wallet_address', referencedColumnName: 'wallet_address' })
  user: User; // This will hold the User object associated with the post

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
