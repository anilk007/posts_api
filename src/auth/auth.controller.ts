import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  async verify(@Body() body: { message: string; signature: string; walletAddress: string }) {
    return this.authService.verifyMessage(body.message, body.signature, body.walletAddress);
  }
}