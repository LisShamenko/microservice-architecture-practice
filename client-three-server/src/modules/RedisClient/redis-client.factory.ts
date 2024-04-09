import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';



// 
export const RedisClientFactory: FactoryProvider<Redis> = {
    provide: 'RedisClient',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {

        const port = configService.get<number>('REDIS_PORT');
        const host = configService.get<string>('REDIS_HOST');
        const password = configService.get<string>('REDIS_PASSWORD');

        const redisInstance = new Redis(port, host, {
            password: password,
        });

        redisInstance.on('error', e => {
            throw new Error(`Redis connection failed: ${e}`);
        });

        return redisInstance;
    },
};
