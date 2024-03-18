import { Inject, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ClientProxy } from '@nestjs/microservices';
import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { Plugin } from '@nestjs/apollo';



// 
@Plugin()
export class RabbitMQPlugin implements ApolloServerPlugin {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
    ) {
        this.logger.debug(`--- AppController: LOADED`);
        this.rabbitClient.connect();
    }

    async requestDidStart(requestContext: any): Promise<GraphQLRequestListener<any>> {
        this.rabbitClient.emit(
            { cmd: 'sequelize' },
            { query: requestContext.request.query },
        );

        console.log('--- Request started = ', requestContext);
        return {
            async willSendResponse() {
                console.log('Will send response');
            },
        };
    }
}
