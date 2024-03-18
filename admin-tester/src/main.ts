import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
//
import { AppModule } from './modules/App/app.module';
import { AdminJSModule } from './modules/AdminJS/adminjs.module';
import { KeycloakModule } from './modules/Keycloak/keycloak.module';
import { MongoModule } from './modules/Mongo/mongo.module';
import { PostgresModule } from './modules/Postgres/postgres.module';
import { LoggerModule } from './modules/Logger/logger.module';
import { RestModule } from './rest/rest.module';
import { allEntities } from './modules/Postgres/entity/entities';
import { UploadModule } from './modules/Upload/upload.module';
import { RabbitMQModule } from './modules/RabbitMQ/rabbit-mq.module';



//
dotenv.config({ path: 'configs/keycloak.env' });

//
async function bootstrap() {

    const importRabbitMQModule = await RabbitMQModule.forRootAsync();
    const importPostgresModule = await PostgresModule.forRootAsync({
        entities: allEntities,
    });
    const importMongoModule = await MongoModule.forRootAsync({});
    const importAdminJSModule = await AdminJSModule.forRootAsync({});
    const importKeycloakModule = await KeycloakModule.forRootAsync({
        authServerUrl: process.env.KEY_URL,
        realm: process.env.KEY_REALM,
        clientId: process.env.KEY_CLIENT_ID,
        secret: process.env.KEY_SECRET,
    });
    const importRestModule = await RestModule.forRootAsync();
    const importLogger = LoggerModule.forRoot();
    const importUpload = UploadModule.forRoot();

    const appModule = await AppModule.forRootAsync({
        imports: [
            importRabbitMQModule,
            importPostgresModule,
            importMongoModule,
            importAdminJSModule,
            importKeycloakModule,
            importRestModule,
            importLogger,
            importUpload,
        ]
    });

    const app = await NestFactory.create<NestExpressApplication>(appModule);

    const nestApp: INestApplication = app;
    const configService = nestApp.get(ConfigService);
    const port = configService.get('PORT');

    await nestApp.listen(port, () => {
        console.log(`http://localhost:${port}`);
        console.log(`http://localhost:${port}/admin`);
        console.log(`http://localhost:${port}/keycloak`);
        console.log(`http://localhost:${port}/api/send`);
        console.log(`http://localhost:${port}/api/emit`);
    });
}
bootstrap();
