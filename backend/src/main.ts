// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 쉼표(,)로 여러 도메인 허용 가능
  const origins = process.env.CORS_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean) ?? [];
  app.enableCors({
    origin: origins.length ? origins : false, // 처음엔 임시로 '*'도 가능하지만 배포 뒤 실제 도메인으로 교체 권장
    credentials: false,
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' });

  await app.listen(Number(process.env.PORT ?? 3000), '0.0.0.0');
}
bootstrap();
