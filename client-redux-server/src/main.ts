import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
//
import { AppModule } from './modules/App/app.module';
import { LoggerModule } from './modules/Logger/logger.module';
import { LoginModule } from './modules/Login/login.module';
import { RedisClientModule } from './modules/RedisClient/redis-client.module';



//
async function bootstrap() {

    const importLogger = LoggerModule.forRoot();
    const importLogin = await LoginModule.forRootAsync();
    const importRedisClientModule = await RedisClientModule.forRootAsync();

    const appModule = await AppModule.forRootAsync({
        imports: [
            importLogger,
            importLogin,
            importRedisClientModule,
        ]
    });

    const cors: string[] = JSON.parse(process.env.CORS);
    const app = await NestFactory.create<NestExpressApplication>(appModule);
    app.enableCors({ origin: cors });

    const nestApp: INestApplication = app;
    const configService = nestApp.get(ConfigService);
    const port = configService.get('PORT');

    await app.listen(port, () => {
        console.log(`http://localhost:${port}`);
    });
}
bootstrap();
