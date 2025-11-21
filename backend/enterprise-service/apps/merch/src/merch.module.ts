import { Module } from '@nestjs/common';
import { MerchController } from './controllers/merch.controller';
import { MerchService } from './services/merch.service';
import { SharedModule } from 'apps/shared2/src/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [MerchController],
  providers: [MerchService],
})
export class MerchModule {}
