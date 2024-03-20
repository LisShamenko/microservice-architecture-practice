import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Redis } from 'ioredis';



// 
export interface IRedisRepository {
    get(prefix: string, key: string): Promise<string | null>;
    set(prefix: string, key: string, value: string): Promise<void>;
    delete(prefix: string, key: string): Promise<void>;
    setWithExpiry(prefix: string, key: string, value: string, expiry: number): Promise<void>;
}

@Injectable()
export class RedisRepository implements OnModuleDestroy, IRedisRepository {
    expiryOneDay: number = 60 * 60 * 24;
    expiryTenMinutes: number = 60 * 10;

    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @Inject('RedisClient') private readonly redisClient: Redis,
    ) {
        this.logger.debug('--- RedisRepository: LOADED');
    }

    onModuleDestroy(): void {
        this.redisClient.disconnect();
    }

    // 
    async get(prefix: string, key: string): Promise<string | null> {
        return this.redisClient.get(`${prefix}:${key}`);
    }

    async set(prefix: string, key: string, value: string) {
        await this.redisClient.set(`${prefix}:${key}`, value);
    }

    async delete(prefix: string, key: string) {
        await this.redisClient.del(`${prefix}:${key}`);
    }

    async setWithExpiry(prefix: string, key: string, value: string, expiry: number) {
        await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
    }

    //
    async saveObject(prefix: string, key: string, data: Object) {
        await this.redisClient.set(
            `${prefix}:${key}`,
            JSON.stringify(data),
            'EX',
            this.expiryOneDay,
        );
    }

    async getObject(prefix: string, key: string): Promise<Object | null> {
        const data = await this.redisClient.get(`${prefix}:${key}`);
        return JSON.parse(data);
    }

    async deleteObject(prefix: string, key: string) {
        await this.redisClient.del(`${prefix}:${key}`);
    }

    // 
    async saveList(prefix: string, data: Object) {
        await this.redisClient.set(
            `${prefix}:list`,
            JSON.stringify(data),
            'EX',
            this.expiryOneDay,
        );
    }

    async getList(prefix: string): Promise<Object | null> {
        const data = await this.redisClient.get(`${prefix}:list`);
        return JSON.parse(data);
    }

    async deleteList(prefix: string) {
        await this.redisClient.del(`${prefix}:list`);
    }

    async deleteObjectWithList(prefix: string, key: string) {
        await this.redisClient.del(`${prefix}:list`, `${prefix}:${key}`);
    }
}
