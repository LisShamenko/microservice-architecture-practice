import { DynamicModule, MiddlewareConsumer } from '@nestjs/common';
import { Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
                    envFilePath: getEnvPath(),
                    isGlobal: true,
                }),
                ...options.imports,
            ],
            controllers: [AppController],
            providers: [AppService],
            exports: [],
        };
    }
}
