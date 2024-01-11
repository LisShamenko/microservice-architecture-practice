import { Controller, Get } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
// 
import { KeycloakService } from './keycloak.service';

//
@Controller('keycloak')
export class KeycloakController {
    constructor(private readonly keycloakService: KeycloakService) {}

    @Get()
    @Unprotected()
    async testKeycloak(): Promise<string> {
        await this.keycloakService.getTest();
        return 'ok';
    }
}
