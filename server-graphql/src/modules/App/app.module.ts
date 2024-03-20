import { DynamicModule, MiddlewareConsumer } from '@nestjs/common';
import { Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
//
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQPlugin } from '../../graphql/plugins/rabbit-mq.plugin';



//
export interface AppModuleOptions {
    imports: DynamicModule[];
}

//
@Module({})
export class AppModule implements NestModule {
    constructor() { }

    configure(consumer: MiddlewareConsumer) { }

    //
    static async forRootAsync(
        options: AppModuleOptions,
    ): Promise<DynamicModule> {
        return {
            global: true,
            module: AppModule,
            imports: [
                ConfigModule.forRoot({
                    envFilePath: 'configs/.env',
                    isGlobal: true,
                }),
                ...options.imports,
            ],
            controllers: [AppController],
            providers: [AppService, RabbitMQPlugin],
            exports: [],
        };
    }
}