// src/entities/user.entity.ts
import { Entity, PrimaryColumn, Column, OneToMany, Index } from 'typeorm';
import { Post } from './post';
import { Like } from './like';
import { Comment } from './comment';

@Entity('users')
@Index('idx_users_username', ['username'])
@Index('idx_users_profile_pic', ['profile_pic_url'], { where: '"profile_pic_url" IS NOT NULL' })
export class User {
  @PrimaryColumn({ length: 42 }) // VARCHAR(42) for Ethereum wallet addresses
  wallet_address: string;

  @Column({ length: 50, unique: true }) // VARCHAR(50) and unique
  username: string;

  @Column({ type: 'text', nullable: true }) // TEXT, can be null
  bio: string | null;

  @Column({ length: 255, nullable: true }) // VARCHAR(255), can be null
  profile_pic_url: string | null;

  // Define relationships
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
