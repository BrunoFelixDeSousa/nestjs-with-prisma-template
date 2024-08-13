import { CurrentUser } from '@/auth/current-user.decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { UserPayload } from '@/auth/jwt.strategy';
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class LogoutAccountController {
  constructor() {}

  @Post('logout')
  async logout(@Req() request: Request) {
    const jwtToken = request.headers.authorization?.split(' ')[1];

    localStorage.removeItem('token');

    return { jwtToken };
  }

  @Post('logout2')
  async logout2(@CurrentUser() user: UserPayload) {
    const userId = user.sub;

    return { userId };
  }
}
