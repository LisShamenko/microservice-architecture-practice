import { DynamicModule, Inject, Module } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
//
import { User } from '../Postgres/Entity/User';
import { Photo } from '../Postgres/Entity/Photo';
import { CatModel } from '../Mongo/Entity/Cat';

//
export interface AdminJSOptions {}

//
@Module({})
export class AdminJSModule {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.debug('--- AdminJSModule: LOADED');
    }

    static async forRootAsync(options: AdminJSOptions): Promise<DynamicModule> {
        // AdminJS version 7 is ESM-only. In order to import it, you have to use dynamic imports.
        return await import('@adminjs/nestjs').then(async ({ AdminModule }) => {
            const AdminJS = await import('adminjs').then(
                async (result) => result.default,
            );

            //
            const AdminJSTypeorm = await import('@adminjs/typeorm');
            AdminJS.registerAdapter({
                Resource: AdminJSTypeorm.Resource,
                Database: AdminJSTypeorm.Database,
            });

            //
            const AdminJSMongoose = await import('@adminjs/mongoose');
            AdminJS.registerAdapter({
                Resource: AdminJSMongoose.Resource,
                Database: AdminJSMongoose.Database,
            });

            //
            const adminJsOptions = {
                rootPath: '/admin',
                resources: [
                    User,
                    Photo,
                    {
                        resource: CatModel,
                        options: {
                            navigation: { name: 'Mongo - Cat' },
                            list: {
                                before: async (req, res, cxt) => {
                                    console.log('--- adminjs = ', req);
                                },
                                handler: async (req, res, cxt) => {
                                    console.log('--- adminjs = ', req);
                                    return { records: [] };
                                },
                            },
                        },
                    },
                ],
            };

            const useFactory = (configService: ConfigService) => ({
                adminJsOptions: adminJsOptions,
                auth: {
                    authenticate: async (email: string, password: string) => {
                        const aEmail = configService.get('AJS_EMAIL');
                        const aPassword = configService.get('AJS_PASSWORD');
                        if (email === aEmail && password === aPassword) {
                            return Promise.resolve({
                                email: aEmail,
                                password: aPassword,
                            });
                        }
                        return null;
                    },
                    cookieName: 'adminjs',
                    cookiePassword: 'secret',
                },
                // sessionOptions: {
                //     resave: true,
                //     saveUninitialized: true,
                //     secret: 'secret'
                // },
            });

            const adminModule = AdminModule.createAdminAsync({
                imports: [
                    ConfigModule.forRoot({
                        envFilePath: 'configs/.env',
                        isGlobal: true,
                    }),
                ],
                useFactory: useFactory,
                inject: [ConfigService],
            });

            return adminModule;
        });
    }
}
