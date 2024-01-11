import { createDatabase, dropDatabase } from 'typeorm-extension';
import { DataSource, DataSourceOptions, QueryRunner } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
// 
import getTestOptions from './getTestOptions';


// 
export class DBTestNative {
    private readonly initialDatabase: string;
    private readonly dbOptions: any;
    private readonly dbEnvs: any;

    constructor() {
        const { dbOptions, initialDatabase, dbEnvs } = getTestOptions();
        this.dbOptions = dbOptions;
        this.initialDatabase = initialDatabase;
        this.dbEnvs = dbEnvs;
    }

    // 
    async createDatabase() {
        await this.dropDatabase();
        await createDatabase({
            options: this.dbOptions,
            initialDatabase: this.initialDatabase,
            // ifNotExist: false,
        });
    }

    // 
    async createDataSource(options: any = {}): Promise<DataSource> {
        const dataSource = new DataSource({
            ...this.dbOptions,
            ...options,
        });
        return await dataSource.initialize();
    }

    getEnvironment() {
        return this.dbEnvs;
    }

    // 
    readSqlFile(filepath: string): string[] {
        return fs
            .readFileSync(path.join(__dirname, filepath))
            .toString()
            .replace(/^--.*\n?/gm, '')
            .replace(/\r?\n|\r/g, '')
            //      .replace(/(\r\n|\n|\r)/gm, " ")
            .replace(/\s+/g, ' ')
            .split(';')
            .filter((query) => query?.length);
    };

    async executeFile(queryRunner: QueryRunner, file: string) {
        const queries = this.readSqlFile(file);
        for (let i = 0; i < queries.length; i++) {
            await queryRunner.query(queries[i]);
        }
    }

    async fillDatabase() {
        const dataSource = await this.createDataSource();

        //
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.executeFile(queryRunner, '../../db/create.sql');
            await this.executeFile(queryRunner, '../../db/insert.sql');
            await queryRunner.commitTransaction();
        }
        catch (err) {
            console.log('--- DBTestNative --- error: ', err.message);
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
            await dataSource.destroy();
        }
    }

    // 
    async dropDatabase(dropAll: boolean = false) {

        if (dropAll) {
            const dataSource = await this.createDataSource({
                database: this.initialDatabase,
            });
            await dataSource.query(`
                SELECT pg_terminate_backend(pg_stat_activity.pid) 
                FROM pg_stat_activity 
                WHERE pg_stat_activity.datname = '${this.dbOptions.database}';`);
            await dataSource.destroy();
        }

        await dropDatabase({
            options: this.dbOptions,
            initialDatabase: this.initialDatabase,
            ifExist: true,
        });
    }
}
