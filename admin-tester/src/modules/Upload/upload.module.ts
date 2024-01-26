

import { DynamicModule, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Inject, Module } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
// 
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

// 
@Module({})
export class UploadModule implements NestModule {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.debug('--- UploadModule: LOADED ---');
    }

    configure(consumer: MiddlewareConsumer) { }

    static forRoot(): DynamicModule {
        return {
            global: true,
            module: UploadModule,
            imports: [],
            controllers: [UploadController],
            providers: [UploadService],
            exports: [],
        };
    }
}
