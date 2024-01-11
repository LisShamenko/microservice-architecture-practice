import { DynamicModule, Inject, Module } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
//
import entities from './entity/entities';
import { PostgresService } from './postgres.service';

//
export interface PostgresModuleOptions {
    entities: any[],
}

//
@Module({})
export class PostgresModule {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.debug('--- PostgresModule: LOADED');
    }

    //
    static async forRootAsync(
        options: PostgresModuleOptions,
    ): Promise<DynamicModule> {

        //
        const importModels = TypeOrmModule.forFeature(entities, 'postgres_db');

        //
        const importRoot = await TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            name: 'postgres_db',
            useFactory: async (configService: ConfigService) => {
                return {
                    type: 'postgres',
                    host: configService.get<string>('PG_HOST'),
                    port: configService.get<string>('PG_PORT'),
                    username: configService.get<string>('PG_USERNAME'),
                    password: configService.get<string>('PG_PASSWORD'),
                    database: configService.get<string>('PG_DATABASE'),
                    entities: options.entities,
                    autoLoadEntities: true,
                } as TypeOrmModuleAsyncOptions;
            },
            dataSourceFactory: async (options) => {
                return new DataSource(options).initialize();
            },
            inject: [ConfigService],
        });

        return {
            global: true,
            module: PostgresModule,
            imports: [
                //ConfigModule.forRoot({
                //    envFilePath: 'configs/.env',
                //    isGlobal: true,
                //}),
                importModels,
                importRoot,
            ],
            providers: [PostgresService],
            exports: [PostgresService],
        };
    }
}
