import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
//
import { AppModule, getEnvPath } from './modules/App/app.module';
import { LoggerModule } from './modules/Logger/logger.module';
import { LoginModule } from './modules/Login/login.module';
import { KeycloakModule } from './modules/Keycloak/keycloak.module';

//
dotenv.config({ path: getEnvPath() });

//
async function bootstrap() {

    const importLogger = LoggerModule.forRoot();
    const importLogin = await LoginModule.forRootAsync();
    const importKeycloak = await KeycloakModule.forRootAsync({
        authServerUrl: process.env.KEYCLOAK_URL,
        realm: process.env.KEYCLOAK_REALM,
        clientId: process.env.KEYCLOAK_CLIENT_ID,
        secret: process.env.KEYCLOAK_CLIENT_SECRET,
    });

    const appModule = await AppModule.forRootAsync({
        imports: [
            importLogger,
            importLogin,
            importKeycloak,
        ]
    });

    const cors: string[] = JSON.parse(process.env.CORS);
    const app = await NestFactory.create<NestExpressApplication>(appModule);
    app.enableCors({ origin: cors });

    const nestApp: INestApplication = app;
    const configService = nestApp.get(ConfigService);
    const port = configService.get('PORT');

    await nestApp.listen(port, () => {
        console.log(`http://localhost:${port}`);
    });
}
bootstrap();
