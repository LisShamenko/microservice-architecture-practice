import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
// 
import { AppService } from './app.service';
import { PostgresService } from '../Postgres/postgres.service';



// 
@Controller('api')
export class AppController {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly appService: AppService,
        private readonly postgresService: PostgresService,
        @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
    ) {
        this.logger.debug(`--- AppController: LOADED`);
        this.rabbitClient.connect();
    }

    @Get('hello')
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('test_find')
    async test(): Promise<any> {
        return this.postgresService.getTest();
    }

    @Get('send')
    async send(): Promise<string> {
        const obs = await this.rabbitClient.send(
            { cmd: 'sequelize' },
            { query: 'sequelize: test send' },
        );

        //     await obs.subscribe();
        return await lastValueFrom(obs);
    }

    @Get('emit')
    async emit(): Promise<string> {
        const obs = this.rabbitClient.emit(
            { cmd: 'sequelize' },
            { query: 'sequelize: test emit' },
        );

        const result = await lastValueFrom(obs);
        console.log('--- result = ', result);
        return Date.now().toString();
    }
}
