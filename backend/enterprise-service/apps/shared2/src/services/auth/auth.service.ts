import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { UserWhereInput } from 'apps/shared2/src/generated/prisma/models';
import { AuthMsgPatterns } from 'apps/shared2/src/types/auth';
import { JwtClaims } from 'apps/shared2/src/types/jwt';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthClient implements OnModuleInit {
  private authClient: ClientProxy

  onModuleInit() {
    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.HOST!,
        port: parseInt(process.env.AUTH_PORT!)
      }
    })
  }

  validateToken(token: string, params: UserWhereInput) {
    return lastValueFrom(
      this.authClient.send<JwtClaims>(AuthMsgPatterns.Authenticate, { token, params })
    )
  }
}
