import { Module } from '@nestjs/common';
import { MerchController } from './controllers/merch.controller';
import { MerchService } from './services/merch.service';
import { SharedModule } from 'apps/shared2/src/shared.module';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';

@Module({
  imports: [SharedModule],
  controllers: [MerchController, CategoryController],
  providers: [MerchService, CategoryService],
})
export class MerchModule {}
