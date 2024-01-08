import { DynamicModule, MiddlewareConsumer } from '@nestjs/common';
import { Module, NestModule } from '@nestjs/common';
//
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
            imports: [importPostgresModule],
            controllers: [AppController],
            providers: [AppService],
            exports: [],
        };
    }
}
