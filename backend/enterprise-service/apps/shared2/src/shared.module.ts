import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthClient } from './services/auth/auth.service';

@Module({
  providers: [PrismaService, AuthClient],
  exports: [PrismaService, AuthClient]
})
export class SharedModule {}
