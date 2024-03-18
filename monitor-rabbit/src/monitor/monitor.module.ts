import { DynamicModule, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Inject, Module } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
// 
import { DBQueryController } from './DatabaseQuery/db-query.controller';
import { DBQueryService } from './DatabaseQuery/db-query.service';



// 
@Module({})
export class MonitorModule implements NestModule {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.debug('--- MonitorModule: LOADED ---');
    }

    configure(consumer: MiddlewareConsumer) { }

    static async forRootAsync(): Promise<DynamicModule> {
        return {
            global: true,
            module: MonitorModule,
            controllers: [DBQueryController],
            providers: [DBQueryService],
        };
    }
}
