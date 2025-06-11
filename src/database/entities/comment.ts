// src/entities/comment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Post } from './post';
import { User } from './user';

@Entity('comments')
@Index('idx_comments_post_id', ['post_id'])
@Index('idx_comments_wallet_address', ['wallet_address'])
@Index('idx_comments_parent_id', ['parent_comment_id'], { where: '"parent_comment_id" IS NOT NULL' })
@Index('idx_comments_timestamp', ['timestamp'])
@Index('idx_comments_not_deleted', ['id'], { where: '"is_deleted" = FALSE' })
// Note: For 'idx_comments_content_trgm' with gin_trgm_ops, TypeORM doesn't directly support it via @Index.
// You would typically add this index directly in your migration or raw SQL.
export class Comment {
  @PrimaryGeneratedColumn() // SERIAL PRIMARY KEY
  id: number;

  @Column() // INTEGER
  post_id: number;

  // Wallet address can be null if the user account is deleted (ON DELETE SET NULL)
  @Column({ length: 42, nullable: true })
  wallet_address: string | null;

  @Column({ type: 'text' }) // TEXT
  content: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' }) // TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  timestamp: Date;

  @Column({ type: 'timestamp with time zone', nullable: true }) // TIMESTAMP WITH TIME ZONE
  edited_at: Date | null;

  @Column({ default: false }) // BOOLEAN DEFAULT FALSE
  is_deleted: boolean;

  // Self-referencing column for replies
  @Column({ nullable: true })
  parent_comment_id: number | null;

  // Define relationships
  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'wallet_address', referencedColumnName: 'wallet_address' })
  user: User | null; // User can be null if `wallet_address` is null

  // Self-referencing relationship for parent/child comments
  @ManyToOne(() => Comment, (comment) => comment.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_comment_id', referencedColumnName: 'id' })
  parentComment: Comment | null;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  children: Comment[];
}
