import { Controller, Delete, Get, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
// 
import { MongoService } from '../Mongo/mongo.service';



// 
@Controller('api')
export class AppController {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly mongoService: MongoService,
        @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
    ) {
        this.logger.debug(`--- AppController: LOADED`);
        this.rabbitClient.connect();
    }

    @Get('test_insert')
    async testInsert(): Promise<any> {
        await this.mongoService.testDelete();
        return await this.mongoService.testInsert();
    }

    @Get('test_find')
    async testFind(): Promise<any> {
        return await this.mongoService.testFind();
    }

    @Delete('test_delete')
    async testDelete(): Promise<any> {
        return await this.mongoService.testDelete();
    }

    @Get('send')
    async send(): Promise<string> {
        const obs = await this.rabbitClient.send(
            { cmd: 'mongo' },
            { message: 'mongo: test send' },
        );

        //     await obs.subscribe();
        return await lastValueFrom(obs);
    }

    @Get('emit')
    async emit(): Promise<string> {
        const obs = this.rabbitClient.emit(
            { cmd: 'mongo' },
            { message: 'mongo: test emit' },
        );

        const result = await lastValueFrom(obs);
        console.log('--- result = ', result);
        return Date.now().toString();
    }
}
