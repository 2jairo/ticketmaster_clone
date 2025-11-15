import { NestFactory } from '@nestjs/core';
import { MerchModule } from './merch.module';
import dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(MerchModule);

  const host = process.env.HOST!
  const port = process.env.MERCH_PORT!
  await app.listen(port, host);
  console.log(`Auth listening on http://${host}:${port}`)
}
void bootstrap();
