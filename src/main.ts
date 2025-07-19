import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
  });
  app.use(morgan(':date[clf] ":method :url"'));
  const port = process.env.PORT || 3001; // Use environment variable or default to 3000
  await app.listen(port); // Explicitly bind to 0.0.0.0
  console.log(`Application is running on`);
}
bootstrap();
