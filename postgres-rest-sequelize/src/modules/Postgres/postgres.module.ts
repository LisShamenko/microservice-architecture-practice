import { DynamicModule, Module } from '@nestjs/common';
import { Inject, LoggerService } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
//
import dbConfig from './../../../configs/db.config';
import { Photo } from './Entity/Photo';
import { User } from './Entity/User';
import { PostgresService } from './postgres.service';

//
export interface PostgresModuleOptions {}

//
@Module({})
export class PostgresModule {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {
        this.logger.debug('PostgresModule: LOADED');
    }

    static async forRootAsync(
        options: PostgresModuleOptions,
    ): Promise<DynamicModule> {
        const importModels = SequelizeModule.forFeature([User, Photo]);

        //
        const importRoot = await SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            //: Promise<SequelizeModuleAsyncOptions>
            useFactory: async (configService: ConfigService) => {
                return {
                    dialect: 'postgres',
                    host: configService.get<string>('database.host'),
                    port: configService.get<string>('database.port'),
                    username: configService.get<string>('database.username'),
                    password: configService.get<string>('database.password'),
                    database: configService.get<string>('database.database'),
                    autoLoadModels: true,
                    synchronize: true,
                    define: {
                        timestamps: false,
                    },
                } as SequelizeModuleAsyncOptions;
            },
            inject: [ConfigService],
        });

        return {
            global: true,
            module: PostgresModule,
            imports: [
                ConfigModule.forRoot({
                    load: [dbConfig],
                    isGlobal: true,
                }),
                importModels,
                importRoot,
            ],
            providers: [PostgresService],
            exports: [PostgresService],
        };
    }
}
