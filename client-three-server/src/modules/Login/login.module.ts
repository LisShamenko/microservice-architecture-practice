import { DynamicModule, Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Logger } from 'winston';
// 
import { LoginController } from './login.controller';
import { LoginService } from './login.service';



// 
@Module({})
export class LoginModule implements NestModule {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.log('info', { message: "--- LoginModule: LOADED --- " });
    }

    configure(consumer: MiddlewareConsumer) { }

    // 
    static async forRootAsync(): Promise<DynamicModule> {
        return {
            global: true,
            module: LoginModule,
            imports: [
                ConfigModule,
                HttpModule,
            ],
            controllers: [LoginController],
            providers: [LoginService],
            exports: [],
        };
    }
}
