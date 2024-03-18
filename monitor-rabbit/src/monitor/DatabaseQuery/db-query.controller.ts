import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
// 
import { DBQueryService } from './db-query.service';
import { IMongoData, ISequelizeData, ITypeormData } from '../../modules/Postgres/entity/DatabaseQuery';



// 
@Controller()
export class DBQueryController {
    constructor(private readonly dbQueryService: DBQueryService) { }

    @MessagePattern({ cmd: 'mongo' })
    async receiveMongoMessage(@Payload() data: IMongoData) {
        return await this.dbQueryService.mongoMessage(data);
    }

    @MessagePattern({ cmd: 'sequelize' })
    async receiveSequelizeMessage(@Payload() data: ISequelizeData) {
        return await this.dbQueryService.sequelizeMessage(data);
    }

    @MessagePattern({ cmd: 'typeorm' })
    async receiveTypeormMessage(@Payload() data: ITypeormData) {
        return await this.dbQueryService.typeormMessage(data);
    }
}
