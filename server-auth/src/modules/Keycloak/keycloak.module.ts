import { DynamicModule, Inject, Module } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { KeycloakConnectModule, PolicyEnforcementMode, TokenValidation } from 'nest-keycloak-connect';
import { ResourceGuard, RoleGuard, AuthGuard } from 'nest-keycloak-connect';
//
import { KeycloakController } from './keycloak.controller';
import { KeycloakService } from './keycloak.service';

//
export interface KeycloakModuleOptions {
    authServerUrl: string;
    realm: string;
    clientId: string;
    secret: string;
}

@Module({})
export class KeycloakModule {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.debug('--- KeycloakModule: LOADED');
    }

    //
    static async forRootAsync(
        options: KeycloakModuleOptions,
    ): Promise<DynamicModule> {

        await import('node-fetch').then(async (result) => {
            if (!globalThis.fetch) {
                // @ts-ignore
                globalThis.fetch = result.default;
                globalThis.Headers = result.Headers;
            }
        });

        await import('form-data').then(async (result) => {
            if (!globalThis.FormData) {
                // @ts-ignore
                globalThis.FormData = result.default;
            }
        });

        return {
            global: true,
            module: KeycloakModule,
            imports: [
                ConfigModule.forRoot({
                    envFilePath: 'configs/keycloak.env',
                    isGlobal: true,
                }),
                // keycloak
                KeycloakConnectModule.register({
                    authServerUrl: options.authServerUrl,
                    realm: options.realm,
                    clientId: options.clientId,
                    secret: options.secret,
                    policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
                    tokenValidation: TokenValidation.ONLINE,
                }),
            ],
            controllers: [KeycloakController],
            providers: [
                KeycloakService,
                // keycloak
                { provide: APP_GUARD, useClass: AuthGuard },
                { provide: APP_GUARD, useClass: ResourceGuard },
                { provide: APP_GUARD, useClass: RoleGuard },
            ],
            exports: [KeycloakService],
        };
    }
}
