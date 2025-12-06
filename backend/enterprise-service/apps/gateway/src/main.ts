import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv'
import compression from 'compression';

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  
  app.use(compression());

  const server = app.getHttpAdapter()
  const host = process.env.HOST!
  const gatewayPort = process.env.GATEWAY_PORT!
  const merchPort = process.env.MERCH_PORT!

  server.use('/api/merch',  createProxyMiddleware({
    target: `http://${host}:${merchPort}`,
    changeOrigin: true,
    pathRewrite: { '^/api/merch': '' },
  }))

  await app.listen(gatewayPort, host);
  console.log(`Gateway listening on http://${host}:${gatewayPort}`)
}

void bootstrap();
