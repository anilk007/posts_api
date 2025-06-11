import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post as PostEntity } from '../database/entities/post';
import { Comment } from '../database/entities/comment';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private usersService: UsersService,
  ) {}

  async getFeed(): Promise<PostEntity[]> {
    return this.postsRepository.find({ order: { createdAt: 'DESC' }, take: 20 });
  }

  async createPost(content: string, authorWallet: string): Promise<PostEntity> {
    const author = await this.usersService.getUser(authorWallet);
    if (!author) {
      throw new Error('User not found');
    }
    const post = this.postsRepository.create({ content, author });
    return this.postsRepository.save(post);
  }

  async likePost(id: number): Promise<PostEntity> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new Error('Post not found');
    }
    post.likeCount += 1;
    return this.postsRepository.save(post);
  }

  async addComment(postId: number, content: string, authorWallet: string): Promise<Comment> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    const author = await this.usersService.getUser(authorWallet);
    if (!post || !author) {
      throw new Error('Post or user not found');
    }
    const comment = this.commentsRepository.create({ content, post, author });
    return this.commentsRepository.save(comment);
  }

  async getPostDetails(id: number): Promise<PostEntity> {
    return this.postsRepository.findOne({
      where: { id },
      relations: ['comments', 'comments.author', 'author'],
    });
  }
}
