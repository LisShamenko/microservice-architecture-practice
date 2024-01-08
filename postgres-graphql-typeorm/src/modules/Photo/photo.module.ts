import { DynamicModule, Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger } from 'winston';
//
import { PhotoResolver } from './photo.resolver';
import { PhotoService } from './photo.service';
import { Photo } from '../Postgres/Entity/Photo';
import { User } from '../Postgres/Entity/User';

//
export interface PhotoModuleOptions {
    logger: Logger;
    postgres: DynamicModule;
}

@Module({})
export class PhotoModule {
    constructor(@Inject('LOGGER') private readonly logger: Logger) {
        this.logger.log('info', { message: 'PhotoModule: LOADED' });
    }

    //
    static async forRootAsync(
        options: PhotoModuleOptions,
    ): Promise<DynamicModule> {
        const importModels = TypeOrmModule.forFeature(
            [User, Photo],
            'postgres_db',
        );

        return {
            global: true,
            module: PhotoModule,
            imports: [importModels, options.postgres],
            providers: [
                PhotoResolver,
                PhotoService,
                { provide: 'LOGGER', useValue: options.logger },
            ],
        };
    }
}
