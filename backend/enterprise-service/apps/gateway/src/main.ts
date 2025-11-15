import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  const server = app.getHttpAdapter()
  const host = process.env.HOST!
  const gatewayPort = process.env.GATEWAY_PORT!
  const merchPort = process.env.MERCH_PORT!

  server.use('/api/dashboard/merch',  createProxyMiddleware({
    target: `http://${host}:${merchPort}`,
    changeOrigin: true,
    pathRewrite: { '^/api/dashboard/merch': '' },
  }))

  await app.listen(gatewayPort, host);
  console.log(`Gateway listening on http://${host}:${gatewayPort}`)
}

void bootstrap();
