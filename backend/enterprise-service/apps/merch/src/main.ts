import { NestFactory } from '@nestjs/core';
import { MerchModule } from './merch.module';
import dotenv from 'dotenv'
import { ValidationPipe } from '@nestjs/common';
import { createSwaggerModule } from './swagger';

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(MerchModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  const host = process.env.HOST!
  const port = process.env.MERCH_PORT!

  createSwaggerModule(app)
  
  await app.listen(port, host);
  console.log(`Merch listening on http://${host}:${port}`)
  console.log(`Swagger docs listening on http://${host}:${port}/docs`)

}
void bootstrap();
