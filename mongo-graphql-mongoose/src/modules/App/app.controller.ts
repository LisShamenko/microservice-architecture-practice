import { ConsoleLogger, Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        @Inject('custom-log') private readonly consoleLogger: ConsoleLogger,
    ) {
        this.consoleLogger.debug(`AppController: LOADED`);
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
