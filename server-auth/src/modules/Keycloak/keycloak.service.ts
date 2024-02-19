import { Injectable, Inject, BadRequestException } from '@nestjs/common';
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
        this.logger.debug('--- KeycloakService: LOADED');

        this.kcAdminClient = new KeycloakAdminClient({
            baseUrl: 'http://127.0.0.1:8080',
            realmName: 'master',
            requestOptions: {
                headers: {
                    'Content-Type': 'text/xml',
                },
            },
        });
    }

    public async getAdmin() {
        if (!this.kcAdminClient.accessToken) {
            await this.kcAdminClient.auth({
                username: this.configService.get('ADMIN_USERNAME'),
                password: this.configService.get('ADMIN_PASSWORD'),
                grantType: this.configService.get('ADMIN_GRANT_TYPE'),
                clientId: this.configService.get('ADMIN_CLIENT_ID'),
                totp: this.configService.get('ADMIN_TOTP'),
                // optional Time-based One-time Password if OTP
                //      is required in authentication flow
            });
        }
        return this.kcAdminClient;
    }

    public async getUser(username: string) {
        const admin = await this.getAdmin();
        return await admin.users.find({
            username: username,
            realm: 'citizen-network',
        });
    }

    public async createUser(username: string, password: string) {
        const admin = await this.getAdmin();
        admin.setConfig({
            realmName: 'citizen-network',
        });

        const appUserRole = await admin.roles.findOneByName({ name: 'app-user' });

        const user = await admin.users.find({
            username: username,
        });
        if (user && user.length !== 0) throw new BadRequestException('user already exists');

        const userResult = await admin.users.create({
            username: username,
            enabled: true,
            credentials: [
                { type: 'password', value: password, temporary: false },
            ],
        });

        await admin.users.addRealmRoleMappings({
            id: userResult.id,
            roles: [
                { id: appUserRole.id, name: appUserRole.name },
            ],
        });

        return userResult.id;
    }
}