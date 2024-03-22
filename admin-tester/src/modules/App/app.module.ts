import { DynamicModule, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Inject, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
//
import { AppController } from './app.controller';
import { AppService } from './app.service';



//
export const getEnvPath = () => {
    return (process.env.NODE_ENV === 'production')
        ? 'configs/.env.production'
        : 'configs/.env.development';
}

export interface AppModuleOptions {
    imports: DynamicModule[];
}

@Module({})
export class AppModule implements NestModule {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.debug('--- AppModule: LOADED ---');
    }

    configure(consumer: MiddlewareConsumer) { }

    //
    static async forRootAsync(
        options: AppModuleOptions,
    ): Promise<DynamicModule> {
        return {
            global: true,
            module: AppModule,
            imports: [
                // config
                ConfigModule.forRoot({
                    envFilePath: getEnvPath(),
                    expandVariables: true,
                }),
                // public
                ServeStaticModule.forRoot(
                    {
                        rootPath: join(__dirname, '../../../public/photos'),
                        serveRoot: '/photos',
                    },
                    {
                        rootPath: join(__dirname, '../../../public/videos'),
                        serveRoot: '/videos',
                    },
                    { rootPath: join(__dirname, '../../../public') },
                ),
                // db, AdminJS, keycloak, rest, logger
                ...options.imports,
            ],
            controllers: [AppController],
            providers: [AppService],
            exports: [],
        };
    }
}
