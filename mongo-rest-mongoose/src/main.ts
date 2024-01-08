import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createLogger } from 'winston';
import * as winston from 'winston';
import { WinstonModule, utilities } from 'nest-winston';
//
import { AppModule } from './modules/App/app.module';

async function bootstrap() {
    const module = await AppModule.forRootAsync();

    const instance = createLogger({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.ms(),
                    utilities.format.nestLike('MyApp', {
                        colors: true,
                        prettyPrint: true,
                    }),
                ),
            }),
        ],
    });

    const app = await NestFactory.create<NestExpressApplication>(module, {
        logger: WinstonModule.createLogger({
            instance,
        }),
    });

    const nestApp: INestApplication = app;
    const configService = nestApp.get(ConfigService);
    const port = configService.get('PORT');

    await app.listen(port, () => console.log(`http://localhost:${port}`));
}
bootstrap();
