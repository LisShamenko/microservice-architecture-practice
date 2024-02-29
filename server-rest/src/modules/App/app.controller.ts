import { Controller, Delete, Get, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
// 
import { MongoService } from '../Mongo/mongo.service';



// 
@Controller('api')
export class AppController {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly mongoService: MongoService,
    ) {
        this.logger.debug(`--- AppController: LOADED`);
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
}
