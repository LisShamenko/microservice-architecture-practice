import { DynamicModule, Logger, Module } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
//
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

    static async forRootAsync(
        options: PostgresModuleOptions,
    ): Promise<DynamicModule> {

        const importModels = SequelizeModule.forFeature(options.entities);

        const importRoot = await SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return {
                    dialect: 'postgres',
                    host: configService.get<string>('PG_HOST'),
                    port: configService.get<string>('PG_PORT'),
                    username: configService.get<string>('PG_USERNAME'),
                    password: configService.get<string>('PG_PASSWORD'),
                    database: configService.get<string>('PG_DATABASE'),
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
            imports: [importModels, importRoot],
            providers: [PostgresService],
            exports: [PostgresService],
        };
    }
}
