import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
  });
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
