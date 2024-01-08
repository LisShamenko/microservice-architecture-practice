import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
//
import { AppModule } from './modules/App/app.module';

//
async function bootstrap() {
    const module = await AppModule.forRootAsync();
    const app = await NestFactory.create<NestExpressApplication>(module);
    await app.listen(3000, () => console.log(`http://localhost:3000`));
}
bootstrap();
