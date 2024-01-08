import { DynamicModule, MiddlewareConsumer } from '@nestjs/common';
import { Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
//
import dbConfig from './../../../configs/db.config';
import { PostgresModule } from '../Postgres/postgres.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//
@Module({})
export class AppModule implements NestModule {
    constructor() {}

    configure(consumer: MiddlewareConsumer) {}

    //
    static async forRootAsync(): Promise<DynamicModule> {
        const importPostgresModule = await PostgresModule.forRootAsync({});

        return {
            global: true,
            module: AppModule,
            imports: [
                importPostgresModule,
                ConfigModule.forRoot({
                    load: [dbConfig],
                    isGlobal: true,
                }),
                WinstonModule.forRoot({
                    transports: [
                        new winston.transports.Console({
                            // winston.format.uncolorize()
                            format: winston.format.simple(),
                            level: 'debug',
                        }),
                    ],
                }),
            ],
            controllers: [AppController],
            providers: [AppService],
            exports: [],
        };
    }
}
