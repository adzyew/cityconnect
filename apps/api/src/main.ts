import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('API_PORT', 4000);
  const webOrigin = configService.get<string>(
    'WEB_ORIGIN',
    'http://localhost:3000',
  );

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: webOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableShutdownHooks();

  await app.listen(port);

  console.log(`CityConnect API: http://localhost:${port}/api`);
}

bootstrap().catch((error: unknown) => {
  console.error('Failed to start CityConnect API:', error);
  process.exit(1);
});
