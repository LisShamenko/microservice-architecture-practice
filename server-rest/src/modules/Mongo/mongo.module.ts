import { DynamicModule, Inject, Module } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
//
import { MongoService } from './mongo.service';



//
export interface MongoModuleOptions {
    imports: DynamicModule[];
}

@Module({})
export class MongoModule {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.debug('--- MongoModule: LOADED');
    }

    //
    static async forRootAsync(
        options: MongoModuleOptions,
    ): Promise<DynamicModule> {

        return {
            global: true,
            module: MongoModule,
            imports: [
                ...options.imports
            ],
            providers: [MongoService],
            exports: [MongoService],
        };
    }
}
