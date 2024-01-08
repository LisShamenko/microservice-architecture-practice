import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
//
import { AppModule } from './modules/App/app.module';

//
dotenv.config({ path: 'configs/keycloak.env' });

//
async function bootstrap() {
    const options = {
        keycloak: {
            authServerUrl: process.env.KEY_URL,
            realm: process.env.KEY_REALM,
            clientId: process.env.KEY_CLIENT_ID,
            secret: process.env.KEY_SECRET,
        },
    };

    const module = await AppModule.forRootAsync(options);
    const app = await NestFactory.create<NestExpressApplication>(module);

    const nestApp: INestApplication = app;
    const configService = nestApp.get(ConfigService);
    const port = configService.get('PORT');

    await nestApp.listen(port, () => {
        console.log(`http://localhost:${port}`);
        console.log(`http://localhost:${port}/admin`);
    });
}
bootstrap();
