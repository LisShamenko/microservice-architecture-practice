import { DynamicModule, Inject, Module } from '@nestjs/common';
import { Logger, LoggerService } from '@nestjs/common';
import { ConfigModule, ConfigType, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';
//
import dbConfig from './../../../configs/db.config';
import { Cat, CatSchema } from './Entity/Cat';
import { MongoService } from './mongo.service';

//
export interface MongoModuleOptions {}

//
@Module({})
export class MongoModule {
    constructor(
        @Inject(dbConfig.KEY) private config: ConfigType<typeof dbConfig>,
        @Inject(Logger) private readonly logger: LoggerService,
    ) {
        this.logger.warn('MongoModule: LOADED');
        this.logger.verbose('config === ', this.config);
    }

    //
    static async forRootAsync(
        options: MongoModuleOptions,
    ): Promise<DynamicModule> {
        const importModels = await MongooseModule.forFeatureAsync(
            [
                {
                    name: Cat.name,
                    collection: 'cats',
                    useFactory: () => {
                        CatSchema.pre('save', () =>
                            console.log(`--- mongo save ---`),
                        );
                        CatSchema.plugin(require('mongoose-autopopulate'));
                        return CatSchema;
                    },
                },
            ],
            'catsDb',
        );

        //
        const importRoot = await MongooseModule.forRootAsync({
            imports: [ConfigModule],
            connectionName: 'catsDb',
            //      schema: CatSchema,
            useFactory: async (
                configService: ConfigService,
            ): Promise<MongooseModuleOptions> => {
                const uri = configService.get<string>('database.MONGO_URI');
                return {
                    uri: uri,
                    dbName: 'test',
                    connectionFactory: () => {
                        const connection = mongoose.connection;
                        mongoose.connect(uri);
                        return connection;
                    },
                };
            },
            inject: [ConfigService],
        });

        return {
            global: true,
            module: MongoModule,
            imports: [
                ConfigModule.forRoot({
                    load: [dbConfig],
                    isGlobal: true,
                }),
                importModels,
                importRoot,
            ],
            providers: [MongoService, Logger],
            exports: [MongoService],
        };
    }
}
