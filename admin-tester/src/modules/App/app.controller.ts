import { Controller, Get } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { KeycloakService } from '../Keycloak/keycloak.service';
//
import { AppService } from './app.service';

//
@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly keycloakService: KeycloakService,
    ) {}

    @Get()
    @Unprotected()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('/test_keycloak')
    @Unprotected()
    async testKeycloak(): Promise<string> {
        await this.keycloakService.getTest();
        return 'ok';
    }
}
