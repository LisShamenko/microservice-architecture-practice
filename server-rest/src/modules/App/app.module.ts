import { DynamicModule, MiddlewareConsumer } from '@nestjs/common';
import { Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
//
import { AppController } from './app.controller';



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
            providers: [],
            exports: [],
        };
    }
}
