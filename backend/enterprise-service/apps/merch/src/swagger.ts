import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const createSwaggerModule = (app: INestApplication) => {
  const merch = new DocumentBuilder()
    .setTitle('Merch API')
    .setDescription('prefix: /api/merch/')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const merchDoc = SwaggerModule.createDocument(app, merch)
  SwaggerModule.setup('docs', app, merchDoc)
}