import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
//
import { AppModule } from './modules/App/app.module';
import { LoggerModule } from './modules/Logger/logger.module';
import { RedisClientModule } from './modules/RedisClient/redis-client.module';
import { LoginModule } from './modules/Login/login.module';



//
async function bootstrap() {

    const importLogger = LoggerModule.forRoot();
    const importRedisClientModule = await RedisClientModule.forRootAsync();
    const importLogin = await LoginModule.forRootAsync();

    const appModule = await AppModule.forRootAsync({
        imports: [
            importLogger,
            importRedisClientModule,
            importLogin,
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
        console.log(`http://192.168.0.102:5540`);
    });
}
bootstrap();
