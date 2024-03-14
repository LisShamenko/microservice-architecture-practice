import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';



// 
export class LoggerModule {
    static forRoot() {
        return WinstonModule.forRoot({
            transports: [
                new winston.transports.Console({
                    format: winston.format.simple(),
                    level: 'debug',
                }),
            ],
        });
    }
}