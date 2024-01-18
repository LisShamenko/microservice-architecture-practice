import { DynamicModule, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Inject, Module } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
// 
import { EnemyController } from './Enemy/enemy.controller';
import { EnemyService } from './Enemy/enemy.service';
import { GameController } from './Game/game.controller';
import { GameService } from './Game/game.service';
import { TemplateController } from './LevelTemplate/template.controller';
import { TemplateService } from './LevelTemplate/template.service';
import { MapController } from './Map/map.controller';
import { MapService } from './Map/map.service';
import { PlayerController } from './Player/player.controller';
import { PlayerService } from './Player/player.service';
import { ProductController } from './Product/product.controller';
import { ProductService } from './Product/product.service';
import { SpawnScriptController } from './Spawn/spawn.script.controller';
import { SpawnScriptService } from './Spawn/spawn.script.service';
import { SkillController } from './Skill/skill.controller';
import { SkillService } from './Skill/skill.service';
// 
import { ErrorHelper } from './services/ErrorHelper';
import { LevelEffectsHelper } from './services/LevelEffectsHelper';
import { ProductHelper } from './services/ProductHelper';
import { PropertyHelper } from './services/PropertyHelper';
import { SkillHelper } from './services/SkillHelper';
import { TemplateHelper } from './services/TemplateHelper';
import { MapHelper } from './services/MapHelper';

//
@Module({})
export class RestModule implements NestModule {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.debug('--- RestModule: LOADED ---');
    }

    configure(consumer: MiddlewareConsumer) { }

    static async forRootAsync(): Promise<DynamicModule> {
        return {
            global: true,
            module: RestModule,
            imports: [],
            controllers: [
                EnemyController, GameController, TemplateController,
                MapController, PlayerController, ProductController,
                SpawnScriptController, SkillController
            ],
            providers: [
                ErrorHelper, LevelEffectsHelper, ProductHelper,
                PropertyHelper, SkillHelper, TemplateHelper,
                MapHelper,
                EnemyService, GameService, TemplateService,
                MapService, PlayerService, ProductService,
                SpawnScriptService, SkillService
            ],
            exports: [],
        };
    }
}
