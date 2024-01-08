import { DynamicModule, MiddlewareConsumer } from '@nestjs/common';
import { Module, NestModule } from '@nestjs/common';
//
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
            imports: [importMongoModule],
            controllers: [AppController],
            providers: [AppService],
            exports: [],
        };
    }
}
