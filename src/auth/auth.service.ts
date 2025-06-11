import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class AuthService {
  async verifyMessage(message: string, signature: string, walletAddress: string): Promise<boolean> {
    try {
      const recoveredAddress = ethers.utils.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    } catch (error) {
      return false;
    }
  }
}