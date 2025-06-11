import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUser(walletAddress: string): Promise<User> {
    return this.usersRepository.findOne({ where: { walletAddress } });
  }

  async createOrUpdateUser(userData: Partial<User>): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { walletAddress: userData.walletAddress } });
    if (!user) {
      user = this.usersRepository.create(userData);
    } else {
      this.usersRepository.merge(user, userData);
    }
    return this.usersRepository.save(user);
  }
}