import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
//
import { AppModule } from './modules/App/app.module';

async function bootstrap() {
    const module = await AppModule.forRootAsync();
    const app = await NestFactory.create<NestExpressApplication>(module);
    const nestApp: INestApplication = app;

    const configService = nestApp.get(ConfigService);
    const port = configService.get('port');
    await app.listen(port, () => console.log(`http://localhost:${port}`));
}
bootstrap();
