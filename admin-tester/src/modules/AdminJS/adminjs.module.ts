import { DynamicModule, Inject, Module } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule, AdminModuleOptions } from '@adminjs/nestjs';
import AdminJS, { AdminJSOptions } from 'adminjs';
import * as AdminJSTypeorm from '@adminjs/typeorm';
import * as AdminJSMongoose from '@adminjs/mongoose';
//
import { User } from '../Postgres/Entity/User';
import { Photo } from '../Postgres/Entity/Photo';
import { CatModel } from '../Mongo/Entity/Cat';

//
export interface AdminOptions {}

//
@Module({})
export class AdminJSModule {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.debug('--- AdminJSModule: LOADED');
    }

    //
    static async forRootAsync(options: AdminOptions): Promise<DynamicModule> {
        AdminJS.registerAdapter({
            Resource: AdminJSTypeorm.Resource,
            Database: AdminJSTypeorm.Database,
        });

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

        //
        const getAuth = (configService: ConfigService) => ({
            authenticate: async (email: string, password: string) => {
                const aEmail = configService.get('AJS_EMAIL');
                const aPassword = configService.get('AJS_PASSWORD');
                if (email === aEmail && password === aPassword) {
                    return Promise.resolve({
                        email: aEmail,
                        password: aPassword,
                        title: 'ADMIN',
                    });
                }
                return null;
            },
            cookieName: 'adminjs', // process.env.AJS_COOKIE_NAME
            cookiePassword: 'secret', // process.env.AJS_COOKIE_PASSWORD
        });

        //
        const adminModule = AdminModule.createAdminAsync({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: 'configs/.env',
                    isGlobal: true,
                }),
            ],
            useFactory: (configService: ConfigService): AdminModuleOptions => ({
                adminJsOptions: adminJsOptions,
                auth: getAuth(configService),
                // sessionOptions: {
                //     resave: true,
                //     saveUninitialized: true,
                //     secret: 'secret'
                // },
            }),
            inject: [ConfigService],
        });
        return adminModule;
    }
}
