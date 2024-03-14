import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
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
import { TestModel } from './entity/TestModel';
import { User } from './entity/User';
import { UserFile } from './entity/UserFile';
import { WeaponShell } from './entity/WeaponShell';


// 
@Injectable()
export class PostgresService {
    constructor(
        @InjectModel(ProductShell) private model: typeof ProductShell,
        private sequelize: Sequelize,
    ) {
        this.model.findAll<ProductShell>()
            .then((r) => console.log('--- ProductShells = ', r));
    }

    async getTest() {

        // ActivityPoint, Map, MapPoint, ActivitySpawn, ActivityTeleport
        const repo1 = this.sequelize.getRepository(ActivityPoint);
        const res1 = await repo1.findAll<ActivityPoint>({
            include: [
                { association: 'map', include: ['points', 'activityPoints', 'game'] },
                { association: 'mapPoint', include: ['map', 'activityPoint'] },
                { association: 'spawn', include: ['point'] },
                { association: 'teleport', include: ['next', 'prev', 'point'] },
            ],
        });

        // const repo2 = this.sequelize.getRepository(ActivitySpawn);
        // const repo3 = this.sequelize.getRepository(ActivityTeleport);

        // Enemy, Inventory, PlayerProperty, LevelTemplate, 
        // SpawnScript, SpawnScriptEnemy, Skill, EnemySkill
        const repo4 = this.sequelize.getRepository(Enemy);
        const res4 = await repo4.findAll<Enemy>({
            include: [
                {
                    association: 'inventory',
                    include: ['enemy', 'levelTemplate', 'products', 'player'],
                },
                {
                    association: 'playerProperty',
                    include: ['enemy', 'levelTemplate', 'player'],
                },
                {
                    association: 'levelTemplate',
                    include: [
                        'playerProperty', 'inventory', 'enemy', 'player', 'skills'
                    ],
                },
                {
                    association: 'scripts',
                    include: ['game', 'enemies'],
                },
                {
                    association: 'skills',
                    include: [
                        'requirement', 'parentSkill', 'products',
                        'childSkills', 'players', 'enemies', 'levelTemplates',
                    ],
                },
            ],
        });

        // const repo5 = this.sequelize.getRepository(EnemySkill);

        // Game, GamePlayer
        const repo6 = this.sequelize.getRepository(Game);
        const res6 = await repo6.findAll<Game>({
            include: [
                { association: 'map', include: ['points', 'activityPoints', 'game'] },
                { association: 'spawnScript' },
                { association: 'ownerPlayer' },
                {
                    association: 'players',
                    include: [
                        'inventory', 'playerProperty', 'levelTemplate',
                        'effects', 'games', 'skills', 'game'
                    ],
                },
            ],
        });

        // const repo7 = this.sequelize.getRepository(GamePlayer);

        // Inventory, Enemy, LevelTemplate, Product, InventoryProduct, 
        // Player, ProductCloth, ProductShell, ProductWeapon, 
        // Requirement
        const repo8 = this.sequelize.getRepository(Inventory);
        const res8 = await repo8.findAll<Inventory>({
            include: [
                { association: 'enemy' },
                { association: 'levelTemplate' },
                {
                    association: 'products',
                    include: [
                        'requirement', 'productCloth',
                        'productWeapon', 'skills', 'inventories',
                        { association: 'productShell', include: ['weapons'] },
                    ],
                },
                { association: 'player' },
            ],
        });

        // const repo9 = this.sequelize.getRepository(InventoryProduct);

        // LevelEffect
        const repo10 = this.sequelize.getRepository(LevelEffect);
        const res10 = await repo10.findAll<LevelEffect>({
            include: [{ association: 'player' }],
        });

        // LevelTemplate, LevelTemplateSkill
        const repo11 = this.sequelize.getRepository(LevelTemplate);
        const res11 = await repo11.findAll<LevelTemplate>({
            include: [
                'playerProperty', 'inventory', 'enemy', 'player', 'skills',
            ],
        });

        // const repo12 = this.sequelize.getRepository(LevelTemplateSkill);
        // const repo13 = this.sequelize.getRepository(Map);
        // const repo14 = this.sequelize.getRepository(MapPoint);

        // Player, Inventory, PlayerProperty, LevelTemplate, 
        // LevelEffect, Game, GamePlayer, Skill, PlayerSkill
        const repo15 = this.sequelize.getRepository(Player);
        const res15 = await repo15.findAll<Player>({
            include: [
                'inventory', 'playerProperty', 'levelTemplate',
                'effects', 'games', 'skills', 'game',
            ],
        });

        // const repo16 = this.sequelize.getRepository(PlayerProperty);
        // const repo17 = this.sequelize.getRepository(PlayerSkill);
        // const repo18 = this.sequelize.getRepository(Product);
        // const repo19 = this.sequelize.getRepository(ProductCloth);
        // const repo20 = this.sequelize.getRepository(ProductShell);
        // const repo21 = this.sequelize.getRepository(ProductSkill);
        // const repo22 = this.sequelize.getRepository(ProductWeapon);
        // const repo23 = this.sequelize.getRepository(Requirement);
        // const repo24 = this.sequelize.getRepository(Skill);
        // const repo25 = this.sequelize.getRepository(SpawnScript);
        // const repo26 = this.sequelize.getRepository(SpawnScriptEnemy);

        const repo27 = this.sequelize.getRepository(TestModel);
        const res27 = await repo27.findAll<TestModel>({
            include: [{
                association: 'user',
                include: [
                    'testModels',
                    { association: 'userFiles', include: ['user'] },
                ],
            }],
        });

        // const repo28 = this.sequelize.getRepository(User);
        // const repo29 = this.sequelize.getRepository(UserFile);
        // const repo30 = this.sequelize.getRepository(WeaponShell);

        return {
            'ActivityPoint': res1,
            'Enemy': res4,
            'Game': res6,
            'Inventory': res8,
            'LevelEffect': res10,
            'LevelTemplate': res11,
            'Player': res15,
            'TestModel': res27,
        };
    }
}
