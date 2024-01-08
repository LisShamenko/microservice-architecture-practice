import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';
//
import { Cat, CatSchema } from './Entity/Cat';
import { MongoService } from './mongo.service';

//
export interface MongoModuleOptions {}

//
@Module({})
export class MongoModule {
    constructor() {}

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
            imports: [],
            connectionName: 'catsDb',
            //      schema: CatSchema,
            useFactory: async (): Promise<MongooseModuleOptions> => {
                const uri = 'mongodb://localhost:27017/test';
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
            inject: [],
        });

        return {
            global: true,
            module: MongoModule,
            imports: [importModels, importRoot],
            providers: [MongoService],
            exports: [MongoService],
        };
    }
}
