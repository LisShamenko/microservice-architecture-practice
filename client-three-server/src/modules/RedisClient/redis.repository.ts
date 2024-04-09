import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Redis } from 'ioredis';
// 
import { Prefix } from './prefix.enum';
import { UserAuthDto } from './dto/user-auth.dto';



// 
@Injectable()
export class RedisRepository implements OnModuleDestroy {
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
    async saveAuth(key: string, data: UserAuthDto) {
        await this.redisClient.set(
            `${Prefix.auth}:${key}`,
            JSON.stringify(data),
            'EX',
            this.expiryOneDay,
        );
    }

    async getAuth(key: string): Promise<UserAuthDto | null> {
        const data = await this.redisClient.get(`${Prefix.auth}:${key}`);
        return JSON.parse(data) as UserAuthDto;
    }

    async deleteAuth(key: string) {
        await this.redisClient.del(`${Prefix.auth}:${key}`);
    }
}
