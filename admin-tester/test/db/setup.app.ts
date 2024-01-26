import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
// 
import { AppModule } from '../../src/modules/App/app.module';
import { PostgresModule } from '../../src/modules/Postgres/postgres.module';
import { LoggerModule } from '../../src/modules/Logger/logger.module';
import { PostgresService } from '../../src/modules/Postgres/postgres.service';
import { dbEntities } from '../../src/modules/Postgres/entity/entities';

/**
 *      "globalSetup": "./db/setup.app.ts",
 */
export default async () => {

    const importPostgresModule = await PostgresModule.forRootAsync({
        entities: dbEntities,
    });
    const importLogger = LoggerModule.forRoot();

    const appModule = await AppModule.forRootAsync({
        imports: [
            importPostgresModule,
            importLogger,
        ]
    });

    const app = await NestFactory.create<NestExpressApplication>(appModule);

    const nestApp: INestApplication = app;
    const postgresService = nestApp.get(PostgresService);
    postgresService.restoreDatabase();

    app.close();
}
