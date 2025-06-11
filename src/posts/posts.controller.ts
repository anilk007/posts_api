import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from '../database/entities/post';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getFeed(): Promise<PostEntity[]> {
    return this.postsService.getFeed();
  }

  @Post()
  async createPost(@Body() postData: { content: string; authorWallet: string }): Promise<PostEntity> {
    return this.postsService.createPost(postData.content, postData.authorWallet);
  }

  @Post(':id/like')
  async likePost(@Param('id') id: number): Promise<PostEntity> {
    return this.postsService.likePost(id);
  }

  @Post(':id/comment')
  async addComment(
    @Param('id') postId: number,
    @Body() commentData: { content: string; authorWallet: string },
  ): Promise<Comment> {
    return this.postsService.addComment(postId, commentData.content, commentData.authorWallet);
  }

  @Get(':id')
  async getPostDetails(@Param('id') id: number): Promise<PostEntity> {
    return this.postsService.getPostDetails(id);
  }
}
