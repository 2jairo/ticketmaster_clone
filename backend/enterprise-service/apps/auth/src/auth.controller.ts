import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { AuthMsgPatterns } from 'apps/shared2/src/types/auth';
import { UserWhereInput } from 'apps/shared2/src/generated/prisma/models';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern(AuthMsgPatterns.Authenticate)
  async validateToken({ token, params }: { token: string, params: UserWhereInput }) {
    return this.authService.authenticate(token, params).catch((e: Error) => new RpcException(e))
  }
}
