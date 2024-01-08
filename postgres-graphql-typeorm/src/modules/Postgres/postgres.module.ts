import { DynamicModule, Inject, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
//
import { getConfigs } from 'src/getConfigs';
import { Photo } from './Entity/Photo';
import { User } from './Entity/User';
import { UserSubscriber } from './Entity/UserSubscriber';
import { PostgresService } from './postgres.service';

//
export interface PostgresModuleOptions {
    logger: Logger;
}

@Module({})
export class PostgresModule {
    constructor(@Inject('LOGGER') private readonly logger: Logger) {
        this.logger.log('info', { message: 'PostgresModule: LOADED' });
    }

    //
    static async forRootAsync(
        options: PostgresModuleOptions,
    ): Promise<DynamicModule> {
        const importModels = TypeOrmModule.forFeature(
            [User, Photo],
            'postgres_db',
        );

        //
        const importRoot = await TypeOrmModule.forRootAsync({
            imports: [],
            name: 'postgres_db',
            useFactory: async () => {
                const configs = getConfigs();
                return {
                    type: 'postgres',
                    host: configs.postgres.host,
                    port: configs.postgres.port,
                    username: configs.postgres.username,
                    password: configs.postgres.password,
                    database: configs.postgres.database,
                    entities: [User, Photo],
                    autoLoadEntities: true,
                } as TypeOrmModuleAsyncOptions;
            },
            dataSourceFactory: async (options) => {
                console.log('------------------------ options = ', options);
                return new DataSource(options).initialize();
            },
            inject: [],
        });

        return {
            global: true,
            module: PostgresModule,
            imports: [importModels, importRoot],
            providers: [
                PostgresService,
                UserSubscriber,
                { provide: 'LOGGER', useValue: options.logger },
            ],
            exports: [PostgresService],
        };
    }
}
