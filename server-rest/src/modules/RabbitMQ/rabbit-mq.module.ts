import { DynamicModule, Logger, Module } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ClientsModule, Transport } from '@nestjs/microservices';



//
@Module({})
export class RabbitMQModule {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.debug('--- RabbitMQModule: LOADED');
    }

    static async forRootAsync(): Promise<DynamicModule> {

        const importRabbit = ClientsModule.registerAsync([
            {
                name: 'RABBITMQ_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => {
                    const user = configService.get('RABBITMQ_USER');
                    const password = configService.get('RABBITMQ_PASSWORD');
                    const host = configService.get('RABBITMQ_HOST');
                    const queueName = configService.get('RABBITMQ_QUEUE_NAME');

                    return {
                        transport: Transport.RMQ,
                        options: {
                            urls: [`amqp://${user}:${password}@${host}`],
                            queue: queueName,
                            queueOptions: {
                                durable: true,
                            },
                        },
                    }
                },
                inject: [ConfigService],
            },
        ]);

        return {
            global: true,
            module: RabbitMQModule,
            imports: [importRabbit],
            exports: [importRabbit],
        };
    }
}
