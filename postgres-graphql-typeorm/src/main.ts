import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
//
import { AppModule } from './modules/App/app.module';
import { getConfigs } from './getConfigs';

async function bootstrap() {
    const module = await AppModule.forRootAsync();
    const app = await NestFactory.create<NestExpressApplication>(module);

    const configs = getConfigs();
    const port = configs.http.port;
    await app.listen(port, () => console.log(`http://localhost:${port}`));
}
bootstrap();
