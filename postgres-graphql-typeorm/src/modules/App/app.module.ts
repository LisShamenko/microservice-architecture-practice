import { DynamicModule, MiddlewareConsumer } from '@nestjs/common';
import { Module, Inject, NestModule } from '@nestjs/common';
import { Logger } from 'winston';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { GraphQLModule } from '@nestjs/graphql';
//
import PostgresLogger from '../../services/PostgresLogger';
import { PostgresModule } from '../Postgres/postgres.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { upperDirectiveTransformer } from './../../graphql/directives/upper-case.directive';
import { UserModule } from '../User/user.module';
import { PhotoModule } from '../Photo/photo.module';

//
const loggerService = new PostgresLogger({});
const logger = loggerService.getLogger();

//
@Module({})
export class AppModule implements NestModule {
    constructor(@Inject('LOGGER') private readonly logger: Logger) {
        this.logger.log('info', { message: 'AppModule: LOADED' });
    }

    configure(consumer: MiddlewareConsumer) {}

    //
    static async forRootAsync(): Promise<DynamicModule> {
        const postgresModule = await PostgresModule.forRootAsync({
            logger,
        });

        const userModule = await UserModule.forRootAsync({
            logger: logger,
            postgres: postgresModule,
        });

        const photoModule = await PhotoModule.forRootAsync({
            logger: logger,
            postgres: postgresModule,
        });

        const importApollo = GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'schema.gql',
            transformSchema: (schema) =>
                upperDirectiveTransformer(schema, 'upper'),
            installSubscriptionHandlers: true,
            buildSchemaOptions: {
                directives: [
                    new GraphQLDirective({
                        name: 'upper',
                        locations: [DirectiveLocation.FIELD_DEFINITION],
                    }),
                ],
            },
        });

        return {
            global: true,
            module: AppModule,
            imports: [userModule, photoModule, postgresModule, importApollo],
            controllers: [AppController],
            providers: [AppService, { provide: 'LOGGER', useValue: logger }],
            exports: [],
        };
    }
}
