import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
// 
import { DBQueryType, DatabaseQuery, IMongoData, ISequelizeData, ITypeormData } from '../../modules/Postgres/entity/DatabaseQuery';
import { DatabaseQueryType } from '../../modules/Postgres/enums/DatabaseQueryType';



// 
@Injectable()
export class DBQueryService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.debug('--- DBQueryService: LOADED');
    }

    async insertMessage(data: DBQueryType, queryType: DatabaseQueryType) {
        const dbQuery = new DatabaseQuery();
        dbQuery.queryType = queryType;
        dbQuery.data = data;
        dbQuery.createdDate = new Date();
        return await dbQuery.save();
    }

    async mongoMessage(data: IMongoData) {
        return await this.insertMessage(data, DatabaseQueryType.mongo);
    }

    async sequelizeMessage(data: ISequelizeData) {
        return await this.insertMessage(data, DatabaseQueryType.sequelize);
    }

    async typeormMessage(data: ITypeormData) {
        return await this.insertMessage(data, DatabaseQueryType.typeorm);
    }
}
