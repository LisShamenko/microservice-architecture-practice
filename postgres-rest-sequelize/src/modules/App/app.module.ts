import { DynamicModule, MiddlewareConsumer } from '@nestjs/common';
import { Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
            ],
            controllers: [AppController],
            providers: [AppService],
            exports: [],
        };
    }
}
