import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
//
import { AppModule } from './modules/App/app.module';
import { LoggerModule } from './modules/Logger/logger.module';



//
async function bootstrap() {

    const importLogger = LoggerModule.forRoot();

    const appModule = await AppModule.forRootAsync({
        imports: [
            importLogger,
        ]
    });

    const app = await NestFactory.create<NestExpressApplication>(appModule);

    const nestApp: INestApplication = app;
    const configService = nestApp.get(ConfigService);
    const port = configService.get('PORT');

    await app.listen(port, () => {
        console.log(`http://localhost:${port}`);
    });
}
bootstrap();
