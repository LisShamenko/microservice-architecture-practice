import { DynamicModule, Inject, Module } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
//
import { ActivityPoint } from './entity/ActivityPoint';
import { ActivitySpawn } from './entity/ActivitySpawn';
import { ActivityTeleport } from './entity/ActivityTeleport';
import { Enemy } from './entity/Enemy';
import { EnemySkill } from './entity/EnemySkill';
import { Game } from './entity/Game';
import { GamePlayer } from './entity/GamePlayer';
import { Inventory } from './entity/Inventory';
import { InventoryProduct } from './entity/InventoryProduct';
import { LevelEffect } from './entity/LevelEffect';
import { LevelTemplate } from './entity/LevelTemplate';
import { LevelTemplateSkill } from './entity/LevelTemplateSkill';
import { Map } from './entity/Map';
import { MapPoint } from './entity/MapPoint';
import { Player } from './entity/Player';
import { PlayerProperty } from './entity/PlayerProperty';
import { PlayerSkill } from './entity/PlayerSkill';
import { Product } from './entity/Product';
import { ProductCloth } from './entity/ProductCloth';
import { ProductShell } from './entity/ProductShell';
import { ProductSkill } from './entity/ProductSkill';
import { ProductWeapon } from './entity/ProductWeapon';
import { Requirement } from './entity/Requirement';
import { Skill } from './entity/Skill';
import { SpawnScript } from './entity/SpawnScript';
import { SpawnScriptEnemy } from './entity/SpawnScriptEnemy';
import { WeaponShell } from './entity/WeaponShell';
// 
import { PostgresService } from './postgres.service';

//
export interface PostgresModuleOptions {}

//
@Module({})
export class PostgresModule {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.debug('--- PostgresModule: LOADED');
    }

    //
    static async forRootAsync(
        options: PostgresModuleOptions,
    ): Promise<DynamicModule> {

        const entities = [
            PlayerProperty, Requirement, Skill, Inventory, LevelTemplate,
            LevelTemplateSkill, Player, Enemy, LevelEffect, PlayerSkill,
            Product, ProductSkill, ProductWeapon, ProductCloth, ProductShell,
            WeaponShell, InventoryProduct, Map, ActivityPoint, MapPoint,
            SpawnScript, SpawnScriptEnemy, Game, GamePlayer, ActivitySpawn,
            ActivityTeleport, EnemySkill,
        ];

        //
        const importModels = TypeOrmModule.forFeature(entities, 'postgres_db');

        //
        const importRoot = await TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            name: 'postgres_db',
            useFactory: async (configService: ConfigService) => {
                return {
                    type: 'postgres',
                    host: configService.get<string>('PG_HOST'),
                    port: configService.get<string>('PG_PORT'),
                    username: configService.get<string>('PG_USERNAME'),
                    password: configService.get<string>('PG_PASSWORD'),
                    database: configService.get<string>('PG_DATABASE'),
                    entities: entities,
                    autoLoadEntities: true,
                } as TypeOrmModuleAsyncOptions;
            },
            dataSourceFactory: async (options) => {
                console.log('--- options = ', options);
                return new DataSource(options).initialize();
            },
            inject: [ConfigService],
        });

        return {
            global: true,
            module: PostgresModule,
            imports: [
                ConfigModule.forRoot({
                    envFilePath: 'configs/.env',
                    isGlobal: true,
                }),
                importModels,
                importRoot,
            ],
            providers: [PostgresService],
            exports: [PostgresService],
        };
    }
}
