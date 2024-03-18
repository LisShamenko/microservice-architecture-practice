import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
//
import { AppModule } from './modules/App/app.module';
import { LoggerModule } from './modules/Logger/logger.module';
import { PostgresModule } from './modules/Postgres/postgres.module';
import { allEntities } from './modules/Postgres/entity/entities';
// 
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { GraphqlModule } from './graphql/graphql.module';
import { RabbitMQModule } from './modules/RabbitMQ/rabbit-mq.module';



//
async function bootstrap() {

    const importRabbitMQModule = await RabbitMQModule.forRootAsync();
    const importPostgresModule = await PostgresModule.forRootAsync({
        entities: allEntities,
    });
    const importLogger = LoggerModule.forRoot();
    const importGraphqlModule = await GraphqlModule.forRootAsync();

    const appModule = await AppModule.forRootAsync({
        imports: [
            importRabbitMQModule,
            importPostgresModule,
            importLogger,
            importGraphqlModule,
        ]
    });

    const app = await NestFactory.create<NestExpressApplication>(appModule);

    //const { schema } = app.get(GraphQLSchemaHost);
    //console.log('--- GraphQL schema = ', schema);

    const nestApp: INestApplication = app;
    const configService = nestApp.get(ConfigService);
    const port = configService.get('PORT');

    await app.listen(port, () => {
        console.log(`http://localhost:${port}/api/hello`);
        console.log(`http://localhost:${port}/api/test_find`);
        console.log(`http://localhost:${port}/api/send`);
        console.log(`http://localhost:${port}/api/emit`);
    });
}
bootstrap();
