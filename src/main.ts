import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'upload')); 
  app.enableCors({
    origin: '*'
  })
  app.use(morgan('tiny'));
  await app.listen(3001);
  console.log(`App started at http://localhost:3001`)
}
bootstrap();
