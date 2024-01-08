import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const configsFile = readFileSync(join(__dirname, 'configs/db.yaml'), 'utf8');

export interface IConfigs {
    http: {
        host: string;
        port: string;
    };
    postgres: {
        host: string;
        port: string;
        username: string;
        password: string;
        database: string;
    };
}

export function getConfigs(): IConfigs {
    const configs = yaml.load(configsFile) as IConfigs;
    return {
        http: {
            host: configs.http.host,
            port: process.env.PORT || configs.http.port,
        },
        postgres: {
            host: process.env.PG_HOST || configs.postgres.host,
            port: process.env.PG_PORT || configs.postgres.port,
            username: process.env.PG_USERNAME || configs.postgres.username,
            password: process.env.PG_PASSWORD || configs.postgres.password,
            database: process.env.PG_DATABASE || configs.postgres.database,
        },
    };
}
