import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DynamicModule, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Inject, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
// 
import { upperDirectiveTransformer } from './directives/upper-case.directive';
import { ErrorHelper } from './resolvers/services/ErrorHelper';
import { LevelEffectsHelper } from './resolvers/services/LevelEffectsHelper';
import { ProductHelper } from './resolvers/services/ProductHelper';
import { PropertyHelper } from './resolvers/services/PropertyHelper';
import { SkillHelper } from './resolvers/services/SkillHelper';
import { TemplateHelper } from './resolvers/services/TemplateHelper';
import { MapHelper } from './resolvers/services/MapHelper';
import { MapResolver } from './resolvers/Map/map.resolver';
import { MapService } from './resolvers/Map/map.service';
import { MapPointResolver } from './resolvers/Map/map-point.resolver';
import { EnemyResolver } from './resolvers/Enemy/enemy.resolver';
import { EnemyService } from './resolvers/Enemy/enemy.service';
import { GameResolver } from './resolvers/Game/game.resolver';
import { GameService } from './resolvers/Game/game.service';
import { LevelTemplateResolver } from './resolvers/LevelTemplate/level-template.resolver';
import { LevelTemplateService } from './resolvers/LevelTemplate/level-template.service';
import { LevelEffectResolver } from './resolvers/Player/level-effect.resolver';
import { PlayerResolver } from './resolvers/Player/player.resolver';
import { PlayerService } from './resolvers/Player/player.service';
import { ProductResolver } from './resolvers/Product/product.resolver';
import { ProductService } from './resolvers/Product/product.service';
import { SkillResolver } from './resolvers/Skill/skill.resolver';
import { SkillService } from './resolvers/Skill/skill.service';
import { SpawnScriptResolver } from './resolvers/Spawn/spawn.resolver';
import { SpawnScriptService } from './resolvers/Spawn/spawn.service';
import { InventoryResolver } from './resolvers/Product/inventory.resolver';
import { GraphQLService } from './resolvers/graphql.service';
import { ProductShellResolver } from './resolvers/Product/product-shell.resolver';
import { ProductWeaponResolver } from './resolvers/Product/product-weapon.resolver';
import { SpawnScriptEnemyResolver } from './resolvers/Spawn/spawn-enemy.resolver';



// 
@Module({})
export class GraphqlModule implements NestModule {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.debug('--- GraphQLModule: LOADED ---');
    }

    configure(consumer: MiddlewareConsumer) { }

    static async forRootAsync(): Promise<DynamicModule> {

        const graphqlModule = GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'schema.gql',
            transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
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
            module: GraphqlModule,
            imports: [
                graphqlModule,
            ],
            controllers: [],
            providers: [
                ErrorHelper, LevelEffectsHelper, ProductHelper,
                PropertyHelper, SkillHelper, TemplateHelper, MapHelper,
                GraphQLService,
                EnemyService, EnemyResolver,
                GameService, GameResolver,
                LevelTemplateService, LevelTemplateResolver,
                MapService, MapResolver, MapPointResolver,
                PlayerService, PlayerResolver, LevelEffectResolver,
                ProductService, ProductResolver,
                SkillService, SkillResolver,
                SpawnScriptService, SpawnScriptResolver, SpawnScriptEnemyResolver,
                InventoryResolver,
                ProductShellResolver, ProductWeaponResolver,
            ],
            exports: [],
        };
    }
}
