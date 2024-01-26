import { ConfigService } from '@nestjs/config';
import { AdminModuleOptions } from '@adminjs/nestjs';

// 
interface AuthUser {
    email: string;
    password: string;
    role: string;
}

export const getAuth = (
    configService: ConfigService
): AdminModuleOptions['auth'] => ({

    authenticate: async (email: string, password: string) => {

        //      const aEmail = configService.get('AJS_EMAIL');
        //      const aPassword = configService.get('AJS_PASSWORD');
        //      if (email === aEmail && password === aPassword) {
        //          return Promise.resolve({
        //              email: aEmail,
        //              password: aPassword,
        //              title: 'ADMIN',
        //          });
        //      }

        try {
            const adminUsers: AuthUser[] = JSON.parse(
                configService.get('AJS_USERS')
            );

            const user = adminUsers.find((u) =>
                (u.email === email && u.password === password)
            );

            if (user) {
                return Promise.resolve({
                    ...user,
                    title: user.role,
                    // access_key
                });
            }
            return null;
        }
        catch (error) {
            return null;
        }
    },
    cookieName: configService.get('AJS_COOKIE_NAME'),
    cookiePassword: configService.get('AJS_COOKIE_PASSWORD'),
});
