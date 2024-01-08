import { Injectable } from '@nestjs/common';
import winston, { format, transports, createLogger } from 'winston';
//
import PostgresTransport from './PostgresTransport';
import { getConfigs } from './../getConfigs';

//
interface IPostgresLoggerOpitons {
    injectMeta?: Object;
}

@Injectable()
export default class PostgresLogger {
    logger: winston.Logger;

    constructor(options: IPostgresLoggerOpitons) {
        const configs = getConfigs();

        this.logger = createLogger({
            format: format.json(),
            defaultMeta: options.injectMeta,
            transports: [
                new transports.File({
                    filename: 'combined.log',
                    dirname: './logs/',
                }),
                new PostgresTransport(
                    {},
                    {
                        host: configs.postgres.host,
                        port: configs.postgres.port,
                        user: configs.postgres.username,
                        password: configs.postgres.password,
                        database: configs.postgres.database,
                    },
                    { project: 'provider-js' },
                ),
                new transports.Console(),
            ],
        });
    }

    getLogger(): winston.Logger {
        return this.logger;
    }
}
