import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
//
import { AppModule } from './modules/App/app.module';

//
async function bootstrap() {
    const module = await AppModule.forRootAsync();
    const app = await NestFactory.create<NestExpressApplication>(module);

    app.useLogger(app.get('custom-log'));

    const nestApp: INestApplication = app;
    const configService = nestApp.get(ConfigService);
    const port = configService.get('PORT');

    await app.listen(port, () => console.log(`http://localhost:${port}`));
}
bootstrap();
