import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import dotenv from 'dotenv'
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const host = process.env.HOST || '127.0.0.1'
  const port = parseInt(process.env.AUTH_PORT!)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host, port
    }
  })
  
  await app.startAllMicroservices()
  console.log(`Auth listening on tcp://${host}:${port}`)
}
void bootstrap();
