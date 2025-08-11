// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS (프론트 도메인 넣기)
  const origins = process.env.CORS_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean) ?? [];
  app.enableCors({
    origin: origins.length ? origins : false, // 처음엔 *도 가능하지만 도메인 지정 권장
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });

  // 정적 서빙: /uploads/* → /app/uploads 의 파일을 GET으로 제공
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' });

  await app.listen(Number(process.env.PORT ?? 3000), '0.0.0.0');
}
bootstrap();
