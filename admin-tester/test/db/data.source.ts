import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
// 
import entities from '../../src/modules/Postgres/entity/entities';
import { M11704800021885 } from '../../migrations/1704800021885-m1';

// 
const processEnv: any = {};

dotenv.config({
    path: 'configs/test.env',
    processEnv: processEnv,
})

/**
 *      npm install ts-node --save-dev
 *      npm run typeorm migration:create ./migrations/m1
 *      npm run typeorm migration:run -- -d ./test/db/data.source.ts
 */
export default new DataSource({
    type: 'postgres',
    host: processEnv.PG_HOST,
    port: processEnv.PG_PORT,
    username: processEnv.PG_USERNAME,
    password: processEnv.PG_PASSWORD,
    database: processEnv.PG_DATABASE,
    entities: entities,
    migrations: [M11704800021885],
    subscribers: [],
});
