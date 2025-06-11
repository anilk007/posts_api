import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../database/entities/user';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':wallet')
  async getUser(@Param('wallet') walletAddress: string): Promise<User> {
    return this.usersService.getUser(walletAddress);
  }

  @Post()
  async createOrUpdateUser(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.createOrUpdateUser(userData);
  }
}