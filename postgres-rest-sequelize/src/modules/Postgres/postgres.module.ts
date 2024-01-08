import { DynamicModule, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';
//
import { Photo } from './Entity/Photo';
import { User } from './Entity/User';
import { PostgresService } from './postgres.service';

//
export interface PostgresModuleOptions {}

//
@Module({})
export class PostgresModule {
    constructor() {}

    static async forRootAsync(
        options: PostgresModuleOptions,
    ): Promise<DynamicModule> {
        const importModels = SequelizeModule.forFeature([User, Photo]);

        //
        const importRoot = await SequelizeModule.forRootAsync({
            imports: [],
            //
            useFactory: async (): Promise<SequelizeModuleAsyncOptions> => {
                return {
                    dialect: 'postgres',
                    host: 'localhost',
                    port: 5432,
                    username: 'postgres',
                    password: 'postgres',
                    database: 'test_1',
                    autoLoadModels: true,
                    synchronize: true,
                    define: {
                        timestamps: false,
                    },
                } as SequelizeModuleAsyncOptions;
            },
            inject: [],
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
