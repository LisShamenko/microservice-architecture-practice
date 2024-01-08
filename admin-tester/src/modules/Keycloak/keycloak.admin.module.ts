import { DynamicModule, Module } from '@nestjs/common';

//
export interface KeycloakAdminModuleOptions {
    username: string;
    password: string;
    grantType: string;
    clientId: string;
    totp: string;
}

//
@Module({})
export class KeycloakAdminModule {
    static async forRootAsync(
        options: KeycloakAdminModuleOptions,
    ): Promise<DynamicModule> {
        await import('@keycloak/keycloak-admin-client').then(async (result) => {
            //
            //      console.log('--- result = ', result);

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

            // To configure the client, pass an object to override any of these  options:
            //  {
            //      baseUrl: 'http://127.0.0.1:8080',
            //      realmName: 'master',
            //      requestOptions: {
            //          /* Fetch request options https://developer.mozilla.org/en-US/docs/Web/API/fetch#options */
            //      },
            //  }
            const kcAdminClient = new result.default({
                baseUrl: 'http://127.0.0.1:8080',
                realmName: 'master',
                requestOptions: {
                    headers: {
                        'Content-Type': 'text/xml',
                    },
                },
            });
            //
            //      console.log('--- kcAdminClient = ', kcAdminClient);

            // Authorize with username / password
            await kcAdminClient.auth({
                username: options.username,
                password: options.password,
                grantType: options.grantType as any,
                clientId: options.clientId,
                // optional Time-based One-time Password if OTP is required in authentication flow
                totp: options.totp,
            });

            // List first page of users
            const users1 = await kcAdminClient.users.find({
                first: 0,
                max: 10,
            });
            //
            //      console.log('--- List first page of users: ', users1);

            // find users by attributes
            const users2 = await kcAdminClient.users.find({ q: 'phone:123' });
            //
            //      console.log('--- Find users by attributes: ', users2);

            // Override client configuration for all further requests:
            kcAdminClient.setConfig({
                realmName: 'citizen-network',
            });

            // This operation will now be performed in 'another-realm' if the user has access.
            //
            const groups = await kcAdminClient.groups.find();
            //      console.log('--- Groups from citizen-network-realm: ', groups);

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
        });

        return {
            global: true,
            module: KeycloakAdminModule,
        };
    }
}
