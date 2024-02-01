import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
// 
import { logFormat } from './../../services/logFormat';

// 
export class LoggerModule {
    static forRoot() {
        return WinstonModule.forRoot({
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
        });
    }
}