import { DynamicModule, MiddlewareConsumer } from '@nestjs/common';
import { Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
//
import dbConfig from './../../../configs/db.config';
import { MongoModule } from '../Mongo/mongo.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//
@Module({})
export class AppModule implements NestModule {
    constructor() {}

    configure(consumer: MiddlewareConsumer) {}

    //
    static async forRootAsync(): Promise<DynamicModule> {
        const importMongoModule = await MongoModule.forRootAsync({});

        return {
            global: true,
            module: AppModule,
            imports: [
                importMongoModule,
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
