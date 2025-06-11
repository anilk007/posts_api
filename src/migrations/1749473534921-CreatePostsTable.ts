import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostsTable1749473534921 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`


          CREATE TABLE users (
            wallet_address VARCHAR(42) PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            bio TEXT,
            profile_pic_url VARCHAR(255)
          );

         -- Indexes for users table
         CREATE INDEX idx_users_username ON users(username);
         CREATE INDEX idx_users_profile_pic ON users(profile_pic_url) WHERE profile_pic_url IS NOT NULL;


         CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(42) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_address) REFERENCES users(wallet_address)
);

-- Indexes for posts table
CREATE INDEX idx_posts_wallet_address ON posts(wallet_address);
CREATE INDEX idx_posts_timestamp ON posts(timestamp);
CREATE INDEX idx_posts_content_trgm ON posts USING gin (content gin_trgm_ops); -- For text search

CREATE TABLE likes (
    post_id INTEGER NOT NULL,
    wallet_address VARCHAR(42) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, wallet_address),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (wallet_address) REFERENCES users(wallet_address) ON DELETE CASCADE
);

-- Indexes for likes table
CREATE INDEX idx_likes_wallet_address ON likes(wallet_address);
CREATE INDEX idx_likes_created_at ON likes(created_at);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    wallet_address VARCHAR(42) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE,
    parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (wallet_address) REFERENCES users(wallet_address) ON DELETE SET NULL
);

-- Indexes for comments table
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_wallet_address ON comments(wallet_address);
CREATE INDEX idx_comments_parent_id ON comments(parent_comment_id) WHERE parent_comment_id IS NOT NULL;
CREATE INDEX idx_comments_timestamp ON comments(timestamp);
CREATE INDEX idx_comments_not_deleted ON comments(id) WHERE is_deleted = FALSE;
CREATE INDEX idx_comments_content_trgm ON comments USING gin (content gin_trgm_ops); -- For text search
            
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            -- Drop comments table indexes first (most dependent)
DROP INDEX IF EXISTS idx_comments_content_trgm;
DROP INDEX IF EXISTS idx_comments_not_deleted;
DROP INDEX IF EXISTS idx_comments_timestamp;
DROP INDEX IF EXISTS idx_comments_parent_id;
DROP INDEX IF EXISTS idx_comments_wallet_address;
DROP INDEX IF EXISTS idx_comments_post_id;

-- Drop likes table indexes
DROP INDEX IF EXISTS idx_likes_created_at;
DROP INDEX IF EXISTS idx_likes_wallet_address;

-- Drop posts table indexes
DROP INDEX IF EXISTS idx_posts_content_trgm;
DROP INDEX IF EXISTS idx_posts_timestamp;
DROP INDEX IF EXISTS idx_posts_wallet_address;

-- Drop users table indexes (least dependent)
DROP INDEX IF EXISTS idx_users_profile_pic;
DROP INDEX IF EXISTS idx_users_username;
        `);
    }
}