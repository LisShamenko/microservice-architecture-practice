import { DynamicModule, Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger } from 'winston';
//
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { Photo } from '../Postgres/Entity/Photo';
import { User } from '../Postgres/Entity/User';

//
export interface UserModuleOptions {
    logger: Logger;
    postgres: DynamicModule;
}

@Module({})
export class UserModule {
    constructor(@Inject('LOGGER') private readonly logger: Logger) {
        this.logger.log('info', { message: 'UserModule: LOADED' });
    }

    //
    static async forRootAsync(
        options: UserModuleOptions,
    ): Promise<DynamicModule> {
        const importModels = TypeOrmModule.forFeature(
            [User, Photo],
            'postgres_db',
        );

        return {
            global: true,
            module: UserModule,
            imports: [importModels, options.postgres],
            providers: [
                UserResolver,
                UserService,
                { provide: 'LOGGER', useValue: options.logger },
            ],
        };
    }
}
