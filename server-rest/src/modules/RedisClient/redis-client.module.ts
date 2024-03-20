import { DynamicModule, Logger, Module } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RedisClientFactory } from './redis-client.factory';
import { RedisRepository } from './redis.repository';



//
@Module({})
export class RedisClientModule {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.debug('--- RedisClientModule: LOADED');
    }

    static async forRootAsync(): Promise<DynamicModule> {
        return {
            global: true,
            module: RedisClientModule,
            providers: [RedisClientFactory, RedisRepository],
            exports: [RedisRepository],
        };
    }
}
