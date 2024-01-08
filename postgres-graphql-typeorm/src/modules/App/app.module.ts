import { DynamicModule, Injectable, MiddlewareConsumer } from '@nestjs/common';
import { Module, Inject, NestModule } from '@nestjs/common';
import { Logger } from 'winston';
//
import PostgresLogger from '../../services/PostgresLogger';
import { PostgresModule } from '../Postgres/postgres.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//
const loggerService = new PostgresLogger({});
const logger = loggerService.getLogger();

//
@Module({})
export class AppModule implements NestModule {
    constructor(@Inject('LOGGER') private readonly logger: Logger) {
        this.logger.log('info', { message: 'AppModule: LOADED' });
    }

    configure(consumer: MiddlewareConsumer) {}

    //
    static async forRootAsync(): Promise<DynamicModule> {
        const importPostgresModule = await PostgresModule.forRootAsync({
            logger,
        });

        return {
            global: true,
            module: AppModule,
            imports: [importPostgresModule],
            controllers: [AppController],
            providers: [AppService, { provide: 'LOGGER', useValue: logger }],
            exports: [],
        };
    }
}
