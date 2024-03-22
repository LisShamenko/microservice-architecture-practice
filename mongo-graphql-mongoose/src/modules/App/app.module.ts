import { DynamicModule, MiddlewareConsumer } from '@nestjs/common';
import { Module, NestModule, ConsoleLogger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
//
import { MongoModule } from '../Mongo/mongo.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { logFormat } from './../../services/logFormat';



//
export const getEnvPath = () => {
    return (process.env.NODE_ENV === 'production')
        ? 'configs/.env.production'
        : 'configs/.env.development';
}

@Module({})
export class AppModule implements NestModule {
    constructor() {}

    configure(consumer: MiddlewareConsumer) {}

    //
    static async forRootAsync(): Promise<DynamicModule> {
        const importMongoModule = await MongoModule.forRootAsync({});

        return {
            global: true,
            module: AppModule,
            imports: [
                importMongoModule,
                ConfigModule.forRoot({
                    envFilePath: getEnvPath(),
                    isGlobal: true,
                }),
                WinstonModule.forRoot({
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        logFormat,
                    ),
                    transports: [
                        new winston.transports.DailyRotateFile({
                            filename: 'logs/server-%DATE%.log',
                            maxSize: '20m',
                            maxFiles: '14d',
                            zippedArchive: true,
                        }),
                        new winston.transports.DailyRotateFile({
                            filename: 'logs/error-%DATE%.log',
                            level: 'error',
                            handleExceptions: true,
                            maxSize: '20m',
                            maxFiles: '14d',
                            zippedArchive: true,
                        }),
                        new winston.transports.Console({
                            format: winston.format.simple(),
                            level: 'error',
                        }),
                    ],
                    exitOnError: false,
                }),
            ],
            controllers: [AppController],
            providers: [
                AppService,
                { provide: 'custom-log', useValue: new ConsoleLogger() },
            ],
            exports: [],
        };
    }
}
