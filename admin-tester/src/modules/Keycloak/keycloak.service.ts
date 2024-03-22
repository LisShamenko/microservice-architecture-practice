import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { KeycloakAdminClient } from '@s3pweb/keycloak-admin-client-cjs';

//
@Injectable()
export class KeycloakService {
    private readonly kcAdminClient: KeycloakAdminClient;

    constructor(
        private readonly configService: ConfigService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.kcAdminClient = new KeycloakAdminClient({
            baseUrl: this.configService.get('KEYCLOAK_URL'),
            realmName: 'master',
            requestOptions: {
                headers: {
                    'Content-Type': 'text/xml',
                },
            },
        });
    }

    public async getTest() {
        if (!this.kcAdminClient.accessToken) {
            try {
                await this.kcAdminClient.auth({
                    username: this.configService.get('KEYCLOAK_ADMIN_USERNAME'),
                    password: this.configService.get('KEYCLOAK_ADMIN_PASSWORD'),
                    grantType: this.configService.get('KEYCLOAK_ADMIN_GRANT_TYPE'),
                    clientId: this.configService.get('KEYCLOAK_ADMIN_CLIENT_ID'),
                    totp: this.configService.get('KEYCLOAK_ADMIN_TOTP'),
                    // optional Time-based One-time Password if OTP
                    //      is required in authentication flow
                });
            } catch (error) {
                this.logger.debug('KeycloakService, repeat auth, ', error);
            }
        }

        const users1 = await this.kcAdminClient.users.find({
            first: 0,
            max: 10,
        });
        console.log('--- List first page of users: ', users1);

        // find users by attributes
        const users2 = await this.kcAdminClient.users.find({ q: 'phone:123' });
        console.log('--- Find users by attributes: ', users2);

        // Override client configuration for all further requests:
        this.kcAdminClient.setConfig({
            realmName: 'citizen-network',
        });

        // This operation will now be performed in 'another-realm' if the user has access.
        const groups = await this.kcAdminClient.groups.find();
        console.log('--- Groups from citizen-network-realm: ', groups);

        // Set a `realm` property to override the realm for only a single operation.
        // For example, creating a user in another realm:
        //
        //      const prefix = Date.now().toString();
        //      const userResult = await kcAdminClient.users.create({
        //          realm: 'citizen-network',
        //          // `username` и `email` должны быть уникальными
        //          username: 'username-' + prefix,
        //          email: 'user-' + prefix + '@example.com',
        //      });
        //      console.log('--- Create user result: ', userResult);
    }
}
