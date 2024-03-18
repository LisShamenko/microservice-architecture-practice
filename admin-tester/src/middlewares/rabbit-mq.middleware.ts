import { Inject, Logger, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ClientProxy } from '@nestjs/microservices';



// 
@Injectable()
export class RabbitMQMiddleware implements NestMiddleware {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
    ) {
        this.logger.debug(`--- RabbitMQMiddleware: LOADED`);
        this.rabbitClient.connect();
    }


    use(req: Request, res: Response, next: NextFunction) {
        this.rabbitClient.emit(
            { cmd: 'typeorm' },
            {
                url: req.originalUrl,
                body: req.body,
                method: req.method,
            },
        );
        next();
    }
}
