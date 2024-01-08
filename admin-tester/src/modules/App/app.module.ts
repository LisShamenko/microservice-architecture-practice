import { DynamicModule, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Inject, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { APP_GUARD } from '@nestjs/core';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { ResourceGuard, RoleGuard, AuthGuard } from 'nest-keycloak-connect';
//
import { AppController } from './app.controller';
import { AppService } from './app.service';
//
import { logFormat } from './../../services/logFormat';
import { PostgresModule } from '../Postgres/postgres.module';
import { MongoModule } from '../Mongo/mongo.module';
import { KeycloakAdminModule } from '../Keycloak/keycloak.admin.module';
import { KeycloakAdminModuleOptions } from '../Keycloak/keycloak.admin.module';
import { AdminJSModule } from '../AdminJS/adminjs.module';

//
export interface AppModuleOptions {
    keycloak: {
        authServerUrl: string;
        realm: string;
        clientId: string;
        secret: string;
    };
    keycloakAdmin: KeycloakAdminModuleOptions;
}

//
@Module({})
export class AppModule implements NestModule {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.debug('--- AppModule: LOADED ---');
    }

    configure(consumer: MiddlewareConsumer) {}

    //
    static async forRootAsync(
        options: AppModuleOptions,
    ): Promise<DynamicModule> {
        const importPostgresModule = await PostgresModule.forRootAsync({});
        const importMongoModule = await MongoModule.forRootAsync({});
        const importAdminJSModule = await AdminJSModule.forRootAsync({});

        return {
            global: true,
            module: AppModule,
            imports: [
                // config
                ConfigModule.forRoot({
                    envFilePath: 'configs/.env',
                    expandVariables: true,
                }),
                // db
                importPostgresModule,
                importMongoModule,
                // AdminJS
                importAdminJSModule,
                // keycloak
                KeycloakConnectModule.register({
                    authServerUrl: options.keycloak.authServerUrl,
                    realm: options.keycloak.realm,
                    clientId: options.keycloak.clientId,
                    secret: options.keycloak.secret,
                }),
                KeycloakAdminModule.forRootAsync(options.keycloakAdmin),
                // logger
                WinstonModule.forRoot({
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        logFormat,
                    ),
                    transports: [
                        new winston.transports.DailyRotateFile({
                            filename: 'logs/server-%DATE%.log',
                            maxSize: '20m',
                            maxFiles: '14d',
                            zippedArchive: true,
                        }),
                        new winston.transports.DailyRotateFile({
                            filename: 'logs/error-%DATE%.log',
                            level: 'error',
                            handleExceptions: true,
                            maxSize: '20m',
                            maxFiles: '14d',
                            zippedArchive: true,
                        }),
                        new winston.transports.Console({
                            format: winston.format.simple(),
                            level: 'error',
                        }),
                    ],
                    exitOnError: false,
                }),
            ],
            controllers: [AppController],
            providers: [
                AppService,
                // keycloak
                { provide: APP_GUARD, useClass: AuthGuard },
                { provide: APP_GUARD, useClass: ResourceGuard },
                { provide: APP_GUARD, useClass: RoleGuard },
            ],
            exports: [],
        };
    }
}
