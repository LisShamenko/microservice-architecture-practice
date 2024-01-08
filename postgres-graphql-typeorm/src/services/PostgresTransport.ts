import { Injectable } from '@nestjs/common';
import * as Transport from 'winston-transport';
import { PoolConfig, Pool } from 'pg';

//
@Injectable()
export default class PostgresTransport extends Transport {
    pool: Pool;
    defaultMeta: Object;

    constructor(
        opts: Transport.TransportStreamOptions,
        postgresOptions: PoolConfig,
        defaultMeta: Object,
    ) {
        super(opts);
        this.pool = new Pool(postgresOptions);
        this.defaultMeta = defaultMeta;
    }

    query(
        queryString: string,
        queryParams: any[],
        cb: (err: Error, result: any) => void,
    ): void {
        return this.pool.query(queryString, queryParams, cb);
    }

    end(cb?: () => void): this {
        if (cb) this.pool.end(cb);
        else this.pool.end();
        return this;
    }

    deleteAll(): void {
        this.query(`DELETE FROM public.winston_logs`, [], (err, res) => {
            console.log('all logs deleted');
        });
    }

    log(info: any, callback: () => void): any {
        console.log(info.json ? info.json : info.message);

        setImmediate(() => {
            this.emit('logged', info);
        });

        if (this.silent !== true) {
            const { level, json, message, meta } = info;
            this.query(
                `
                INSERT INTO public.winston_logs(level, message, meta, "timestamp")
                VALUES ($1, $2, $3, NOW())`,
                [
                    level,
                    json ? json : { message: message },
                    JSON.stringify({ ...meta, ...this.defaultMeta }),
                ],
                (error: Error, result: any) => {
                    console.log(json ? json : message);
                },
            );
        }

        // Perform the writing to the remote service
        callback();
    }
}
