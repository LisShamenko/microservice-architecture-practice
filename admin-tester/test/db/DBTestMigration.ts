import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { createDatabase, dropDatabase } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
// 
import { dbEntities } from '../../src/modules/Postgres/entity/entities';

// 
const processEnv: any = {};

dotenv.config({
    path: 'configs/test.env',
    processEnv: processEnv,
})

export class DBTestMigration {
    private readonly dbOptions: PostgresConnectionOptions;

    constructor() {
        this.dbOptions = {
            type: 'postgres',
            host: processEnv.PG_HOST,
            port: processEnv.PG_PORT,
            username: processEnv.PG_USERNAME,
            password: processEnv.PG_PASSWORD,
            database: processEnv.PG_DATABASE,
            entities: dbEntities,
            // migrations: migrations,
        } as PostgresConnectionOptions;
    }

    /**
     * @example
     *      // jest-e2e.json
     *      {
     *          "globalSetup": "./db/setup.ts"
     *      }
     * 
     *      // setup.ts
     *      export default async () => {
     *          globalThis.databaseConfig = new DBTestMigration();
     *          await globalThis.databaseConfig.createDatabase();
     *      };
     */
    async createDatabase() {

        await this.dropDatabase();

        await createDatabase({
            options: this.dbOptions,
            initialDatabase: this.dbOptions.database,
            //      ifNotExist: false,
        });

        //      const dataSource = await this.createDataSource();
        //      dataSource.runMigrations({ transaction: 'all' });
        //      await dataSource.destroy();
    }

    /**
     * @example
     *      // jest-e2e.json
     *      {
     *          "globalTeardown": "./db/teardown.ts",
     *          "openHandlesTimeout": 10000
     *      }
     * 
     *      // teardown.ts
     *      module.exports = async () => {
     *          await globalThis.databaseConfig.dropDatabase(true);
     *      };
     */
    async dropDatabase(dropAll: boolean = false) {

        if (dropAll) {
            const ds = await this.createDataSource();
            await ds.query(`
                SELECT pg_terminate_backend(pg_stat_activity.pid) 
                FROM pg_stat_activity 
                WHERE pg_stat_activity.datname = '${this.dbOptions.database}';`);
        }

        await dropDatabase({
            options: this.dbOptions,
            initialDatabase: this.dbOptions.database,
        });
    }

    async createDataSource() {
        const dataSource = new DataSource(this.dbOptions);
        await dataSource.initialize();
        return dataSource;
    }
}
