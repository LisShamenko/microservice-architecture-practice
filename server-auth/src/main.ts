import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
//
import { AppModule } from './modules/App/app.module';
import { LoggerModule } from './modules/Logger/logger.module';
import { LoginModule } from './modules/Login/login.module';
import { KeycloakModule } from './modules/Keycloak/keycloak.module';

//
dotenv.config({ path: 'configs/keycloak.env' });

//
async function bootstrap() {

    const importLogger = LoggerModule.forRoot();
    const importLogin = await LoginModule.forRootAsync();
    const importKeycloak = await KeycloakModule.forRootAsync({
        authServerUrl: process.env.URL,
        realm: process.env.REALM,
        clientId: process.env.CLIENT_ID,
        secret: process.env.CLIENT_SECRET,
    });

    const appModule = await AppModule.forRootAsync({
        imports: [
            importLogger,
            importLogin,
            importKeycloak,
        ]
    });

    const app = await NestFactory.create<NestExpressApplication>(appModule);
    app.enableCors({ origin: ['http://localhost:3000'] });

    const nestApp: INestApplication = app;
    const configService = nestApp.get(ConfigService);
    const port = configService.get('PORT');

    await nestApp.listen(port, () => {
        console.log(`http://localhost:${port}`);
        console.log(`http://localhost:${port}/admin`);
        console.log(`http://localhost:${port}/keycloak`);
    });
}
bootstrap();
