import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post as PostEntity } from '../database/entities/post';
import { Comment } from '../database/entities/comment';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, Comment]), UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}