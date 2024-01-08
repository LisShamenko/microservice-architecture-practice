import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
//
import { Photo } from './Entity/Photo';
import { User } from './Entity/User';
import { UserSubscriber } from './Entity/UserSubscriber';
import { PostgresService } from './postgres.service';

export interface PostgresModuleOptions {}

@Module({})
export class PostgresModule {
    constructor() {}

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
                return {
                    type: 'postgres',
                    host: 'localhost',
                    port: 5432,
                    username: 'postgres',
                    password: 'postgres',
                    database: 'test_1',
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
            providers: [PostgresService, UserSubscriber],
            exports: [PostgresService],
        };
    }
}
