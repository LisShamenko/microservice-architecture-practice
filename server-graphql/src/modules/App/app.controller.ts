import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
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
    ) {
        this.logger.debug(`--- AppController: LOADED`);
    }

    @Get('hello')
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('test_find')
    async test(): Promise<any> {
        return this.postgresService.getTest();
    }
}
