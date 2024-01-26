import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
// 
import { AppModule } from '../../../src/modules/App/app.module';
import { PostgresModule } from '../../../src/modules/Postgres/postgres.module';
import { MongoModule } from '../../../src/modules/Mongo/mongo.module';
import { RestModule } from '../../../src/rest/rest.module';
import { dbEntities } from '../../../src/modules/Postgres/entity/entities';

// 
describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {

        const importPostgresModule = await PostgresModule.forRootAsync({
            entities: dbEntities,
        });
        const importMongoModule = await MongoModule.forRootAsync({});
        const importRestModule = await RestModule.forRootAsync();

        const appModule = await AppModule.forRootAsync({
            imports: [
                importPostgresModule,
                importMongoModule,
                importRestModule,
                WinstonModule.forRoot({
                    transports: [new winston.transports.Console({})],
                }),
            ]
        });

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [appModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
    });
});
