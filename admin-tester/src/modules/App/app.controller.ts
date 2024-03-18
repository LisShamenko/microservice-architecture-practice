import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Unprotected } from 'nest-keycloak-connect';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
//
import { AppService } from './app.service';



//
@Controller()
export class AppController {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly appService: AppService,
        @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
    ) {
        this.logger.debug(`--- AppController: LOADED`);
        this.rabbitClient.connect();
    }

    @Get()
    @Unprotected()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('send')
    async send(): Promise<string> {
        const obs = await this.rabbitClient.send(
            { cmd: 'typeorm' },
            { message: 'typeorm: test send' },
        );

        //     await obs.subscribe();
        return await lastValueFrom(obs);
    }

    @Get('emit')
    async emit(): Promise<string> {
        const obs = this.rabbitClient.emit(
            { cmd: 'typeorm' },
            { message: 'typeorm: test emit' },
        );

        const result = await lastValueFrom(obs);
        console.log('--- result = ', result);
        return Date.now().toString();
    }
}
