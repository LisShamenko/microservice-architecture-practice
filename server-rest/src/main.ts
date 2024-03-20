import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';
//
import { entityFactories } from './modules/Mongo/Entity/entities';
import { AppModule } from './modules/App/app.module';
import { LoggerModule } from './modules/Logger/logger.module';
import { MongoModule } from './modules/Mongo/mongo.module';
import { RestModule } from './rest/rest.module';
import { RabbitMQModule } from './modules/RabbitMQ/rabbit-mq.module';
import { RedisClientModule } from './modules/RedisClient/redis-client.module';



//
async function bootstrap() {

    const importRedisClientModule = await RedisClientModule.forRootAsync();

    const importRabbitMQModule = await RabbitMQModule.forRootAsync();

    const importLogger = LoggerModule.forRoot();

    const importModels = await MongooseModule.forFeatureAsync(
        entityFactories, 'db'
    );

    const importRoot = await MongooseModule.forRootAsync({
        imports: [ConfigModule],
        connectionName: 'db',
        useFactory: async (
            configService: ConfigService,
        ): Promise<MongooseModuleOptions> => {
            const uri = configService.get<string>('MONGO_URI');
            return {
                uri: uri,
                dbName: 'test',
                connectionFactory: () => {
                    const connection = mongoose.connection;
                    mongoose.connect(uri);
                    return connection;
                },
            };
        },
        inject: [ConfigService],
    });

    const importMongoModule = await MongoModule.forRootAsync({
        imports: [importModels, importRoot],
    });

    const importRestModule = await RestModule.forRootAsync({
        imports: [importModels, importRoot],
    });

    const appModule = await AppModule.forRootAsync({
        imports: [
            importRedisClientModule,
            importRabbitMQModule,
            importLogger,
            importMongoModule,
            importRestModule,
        ]
    });

    const app = await NestFactory.create<NestExpressApplication>(appModule);

    const nestApp: INestApplication = app;
    const configService = nestApp.get(ConfigService);
    const port = configService.get('PORT');

    await app.listen(port, () => {
        console.log(`http://localhost:${port}/api/hello`);
        console.log(`http://localhost:${port}/api/test_insert`);
        console.log(`http://localhost:${port}/api/test_find`);
        console.log(`http://localhost:${port}/api/send`);
        console.log(`http://localhost:${port}/api/emit`);
    });
}
bootstrap();
