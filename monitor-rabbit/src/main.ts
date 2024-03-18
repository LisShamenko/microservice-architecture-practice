import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// 
import { PostgresModule } from './modules/Postgres/postgres.module';
import { LoggerModule } from './modules/Logger/logger.module';
import { MonitorModule } from './monitor/monitor.module';
import { AppModule } from './modules/App/app.module';
import { allEntities } from './modules/Postgres/entity/entities';



// 
async function bootstrap() {

    const importPostgresModule = await PostgresModule.forRootAsync({
        entities: allEntities,
    });
    const importLogger = LoggerModule.forRoot();
    const importMonitorModule = await MonitorModule.forRootAsync();

    const appModule = await AppModule.forRootAsync({
        imports: [
            importPostgresModule,
            importLogger,
            importMonitorModule,
        ]
    });

    const app = await NestFactory.create<NestExpressApplication>(appModule);

    const nestApp: INestApplication = app;
    const configService = nestApp.get(ConfigService);

    // 
    const user = configService.get('RABBITMQ_USER');
    const password = configService.get('RABBITMQ_PASSWORD');
    const host = configService.get('RABBITMQ_HOST');
    const queueName = configService.get('RABBITMQ_QUEUE_NAME');

    await app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: queueName,
            queueOptions: {
                durable: true,
            },
        },
    });
    app.startAllMicroservices();

    // 
    const port = configService.get('PORT');
    await app.listen(port, () => {
        console.log(`http://localhost:${port}`);
    });
}
bootstrap();
