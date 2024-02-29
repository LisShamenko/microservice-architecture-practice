import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
//
import { Skill, SkillDocument } from './Entity/Skill';
import { LevelTemplate, LevelTemplateDocument } from './Entity/LevelTemplate';
import { Product, ProductCloth, ProductDocument, ProductShell, ProductWeapon } from './Entity/Product';
import { LevelEffect, Player, PlayerDocument } from './Entity/Player';
import { Enemy, EnemyDocument } from './Entity/Enemy';
import { Game, GameDocument } from './Entity/Game';
import { SpawnScript, SpawnScriptDocument, SpawnScriptEnemy } from './Entity/SpawnScript';
import { SpawnPoint, TeleportPoint, Map, MapDocument, MapPoint } from './Entity/Map';
// 
import { Requirement } from './Entity/Requirement';
import { Inventory, InventoryProduct } from './Entity/Inventory';
import { PlayerProperty } from './Entity/PlayerProperty';
import { Sorting } from './enums/Sorting';
import { ProductTypes } from './enums/ProductTypes';
import { EnemyTypes } from './enums/EnemyTypes';
import { ActivityPointTypes } from './enums/ActivityPointTypes';



// 
@Injectable()
export class MongoService {
    constructor(
        @InjectModel(Skill.name, 'db') private skillModel: Model<SkillDocument>,
        @InjectModel(LevelTemplate.name, 'db') private levelTemplateModel: Model<LevelTemplateDocument>,
        @InjectModel(Product.name, 'db') private productModel: Model<ProductDocument>,
        @InjectModel(Player.name, 'db') private playerModel: Model<PlayerDocument>,
        @InjectModel(Enemy.name, 'db') private enemyModel: Model<EnemyDocument>,
        @InjectModel(Game.name, 'db') private gameModel: Model<GameDocument>,
        @InjectModel(SpawnScript.name, 'db') private spawnScriptModel: Model<SpawnScriptDocument>,
        @InjectModel(Map.name, 'db') private mapModel: Model<MapDocument>,
    ) { }

    // insert

    async insertSkill(title: string, parentId: Types.ObjectId | null, requirement: Requirement) {
        const skill: Skill = {
            title: title,
            parent_skill_id: (parentId) ? parentId : null,
            requirements: requirement,
        } as Skill;
        const newSkill = new this.skillModel(skill);
        const result = await newSkill.save();
        return result;
    }

    async insertLevelTemplate(
        title: string, properties: PlayerProperty,
        inventory: Inventory, coins: number, skill_ids: string[],
    ) {
        const levelTemplate: LevelTemplate = {
            title: title,
            coins: coins,
            inventory: inventory,
            properties: properties,
            skills: skill_ids,
        } as LevelTemplate;
        const model = new this.levelTemplateModel(levelTemplate);
        return await model.save();
    }

    async insertProduct(
        title: string, price: number, maxInSlot: number,
        requirements: Requirement, productType: ProductTypes,
        skills: string[],
    ) {
        const product: Product = {
            title: title,
            price: price,
            max_in_slot: maxInSlot,
            requirements: requirements,
            product_type: productType,
            cloth: null,
            shell: null,
            weapon: null,
            skills: skills,
        } as Product;
        const model = new this.productModel(product);
        const newProduct = await model.save();
        return newProduct;
    }
    async setProductCloth(product: ProductDocument, productId: Types.ObjectId) {
        product.cloth = {
            product_id: productId,
        } as ProductCloth;
        await product.save();
    }
    async setProductShell(product: ProductDocument, productId: Types.ObjectId, weapons: string[]) {
        product.shell = {
            product_id: productId,
            weapons: weapons,
        } as ProductShell;
        await product.save();
    }
    async setProductWeapon(product: ProductDocument, productId: Types.ObjectId, shells: string[]) {
        product.weapon = {
            product_id: productId,
            shells: shells,
        } as ProductWeapon;
        await product.save();
    }

    async insertPlayer(
        inventory: Inventory, properties: PlayerProperty,
        template_id: Types.ObjectId, login: string, password: string,
        firstname: string, secondname: string, thirdname: string,
        email: string, skill_ids: string[], effects: LevelEffect[],
    ) {
        const player: Player = {
            login: login,
            password: password,
            firstname: firstname,
            secondname: secondname,
            thirdname: thirdname,
            email: email,
            inventory: inventory,
            properties: properties,
            level_template_id: template_id,
            level_effects: effects,
            skills: skill_ids,
            owner_game_id: null,
        } as Player;
        const model = new this.playerModel(player);
        return await model.save();
    }

    async insertEnemy(
        nickname: string, inventory: Inventory, properties: PlayerProperty,
        template_id: Types.ObjectId, skill_ids: string[]
    ) {
        const enemy: Enemy = {
            nickname: nickname,
            enemy_type: EnemyTypes.Test,
            inventory: inventory,
            properties: properties,
            level_template_id: template_id,
            skills: skill_ids,
        } as Enemy;
        const model = new this.enemyModel(enemy);
        return await model.save();
    }

    async insertSpawnScript(title: string, waves: SpawnScriptEnemy[]) {
        const spawnScript: SpawnScript = {
            title: title,
            waves: waves,
        } as SpawnScript;
        const model = new this.spawnScriptModel(spawnScript);
        return await model.save();
    }

    async insertMap(sceneId: string, title: string, mapPoints: MapPoint[]) {
        const map: Map = {
            scene_id: sceneId,
            title: title,
            map_points: mapPoints,
        } as Map;
        const model = new this.mapModel(map);
        return await model.save();
    }

    getNonePoint(i: number, position: number[]) {
        return {
            index: i,
            position: position,
            point_type: ActivityPointTypes.none,
            spawn: null,
            teleport: null,
        } as MapPoint;
    }
    getSpawnPoint(
        i: number, position: number[],
        isPlayer: boolean, isEnemy: boolean,
    ) {
        return {
            index: i,
            position: position,
            point_type: ActivityPointTypes.spawn,
            spawn: {
                is_player: isPlayer,
                is_enemy: isEnemy,
            } as SpawnPoint,
        } as MapPoint;
    }
    getTeleportPoint(
        i: number, position: number[],
        prevIndex: number, nextIndex: number,
    ) {
        return {
            index: i,
            position: position,
            point_type: ActivityPointTypes.teleport,
            spawn: null,
            teleport: {
                prev_index: prevIndex,
                next_index: nextIndex,
            } as TeleportPoint,
        } as MapPoint;
    }

    async insertGame(map_id: string, script_id: string, owner_id: string) {
        const game: Game = {
            map_id: new Types.ObjectId(map_id),
            spawn_script_id: new Types.ObjectId(script_id),
            owner_player_id: new Types.ObjectId(owner_id),
            players: [owner_id],
        } as Game;
        const model = new this.gameModel(game);
        return await model.save();
    }

    getRequirement(title: string, playerLevel: number, options?: any) {
        return {
            title: title,
            player_level: playerLevel,
            ...options,
        } as Requirement;
    }

    getPlayerProperty(
        strength: number, endurance: number, intelligence: number,
        agility: number, fire_weapons: number, melee_weapons: number,
        throwing: number, doctor: number, sneak: number, steal: number,
        traps: number, science: number, repair: number, barter: number,
    ) {
        return {
            strength: strength, endurance: endurance, intelligence: intelligence,
            agility: agility, fire_weapons: fire_weapons, melee_weapons: melee_weapons,
            throwing: throwing, doctor: doctor, sneak: sneak, steal: steal,
            traps: traps, science: science, repair: repair, barter: barter,
        } as PlayerProperty;
    }

    async testInsert() {

        // insert skills

        const req_1 = this.getRequirement('minimal', 0);
        const req_2 = this.getRequirement('jump kick I', 5, {
            strength: 5, agility: 5, melee_weapons: 10,
        });
        const req_3 = this.getRequirement('jump kick II', 10, {
            strength: 6, agility: 6, melee_weapons: 30,
        });
        const req_4 = this.getRequirement('jump kick III', 10, {
            strength: 8, agility: 6, melee_weapons: 70,
        });

        const skill_1 = await this.insertSkill('удар', null, req_2);
        const skill_2 = await this.insertSkill('удар в прыжке', skill_1._id, req_3);
        const skill_3 = await this.insertSkill('удар в двойном прыжке', skill_2._id, req_4);

        // insert product

        const req_5 = this.getRequirement('jump kick III', 0, {
            strength: 10,
        });

        const product_1 = await this.insertProduct(
            'штаны пинателя', 1, 5, req_5, ProductTypes.cloth, [skill_3.id],
        );
        const product_2 = await this.insertProduct(
            'ракушки', 1, 50, req_5, ProductTypes.shell, [],
        );
        const product_3 = await this.insertProduct(
            'меч', 1, 1, req_5, ProductTypes.weapon, [],
        );

        await this.setProductCloth(product_1, product_1._id);
        await this.setProductShell(product_2, product_2._id, [product_3.id]);
        await this.setProductWeapon(product_3, product_3._id, [product_2.id]);

        // insert templates

        const properties_1 = this.getPlayerProperty(
            5, 6, 4, 5, 14, 13, 14, 3, 13, 3, 6, 1, 3, 16
        );
        const properties_2 = this.getPlayerProperty(
            6, 7, 3, 6, 21, 49, 38, 6, 30, 4, 8, 4, 5, 49
        );
        const properties_3 = this.getPlayerProperty(
            9, 8, 1, 8, 36, 91, 65, 10, 35, 6, 10, 6, 8, 50
        );

        const inventory_1 = {
            sorting: Sorting.none,
            products: [
                { product_id: product_1._id, count_in_all_slots: 2 } as InventoryProduct,
                { product_id: product_2._id, count_in_all_slots: 5 } as InventoryProduct,
            ],
        } as Inventory;

        const level_1 = await this.insertLevelTemplate(
            'юный боец на ногах', properties_1, inventory_1, 100,
            [skill_1.id],
        );
        const level_2 = await this.insertLevelTemplate(
            'опытный боец на ногах', properties_2, inventory_1, 200,
            [skill_1.id, skill_2.id],
        );
        const level_3 = await this.insertLevelTemplate(
            'мастер боя на ногах', properties_3, inventory_1, 40,
            [skill_1.id, skill_2.id, skill_3.id],
        );

        // insert enemy

        const inventory_2 = { sorting: Sorting.none, products: [] } as Inventory;

        const properties_4 = this.getPlayerProperty(
            6, 7, 3, 6, 21, 49, 38, 6, 30, 4, 8, 4, 5, 49
        );

        const enemy_1 = await this.insertEnemy(
            'first enemy', inventory_2, properties_4,
            level_1._id, [],
        );

        // insert player template

        const inventory_3 = { sorting: Sorting.none, products: [] } as Inventory;

        const properties_5 = this.getPlayerProperty(
            5, 5, 5, 5, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15
        );

        const level_4 = await this.insertLevelTemplate(
            'шаблон игрока', properties_5, inventory_3, 1000, [],
        );

        // insert player I

        const inventory_4 = {
            sorting: Sorting.none,
            products: [
                { product_id: product_1._id, count_in_all_slots: 1 } as InventoryProduct,
                { product_id: product_2._id, count_in_all_slots: 25 } as InventoryProduct,
            ],
        } as Inventory;

        const properties_6 = this.getPlayerProperty(
            5, 5, 5, 5, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15
        );

        const level_effects_1 = [
            {
                count_matches: 1,
                is_equipment: false,
                property_column: 'strength',
                delta_value: 5,
            } as LevelEffect,
        ];

        const player_1 = await this.insertPlayer(
            inventory_4, properties_6, level_4._id,
            'login', 'password', 'first', 'second', 'third',
            'fst@email.com', [skill_1.id], level_effects_1,
        );

        // insert player II

        const inventory_5 = { sorting: Sorting.none, products: [] } as Inventory;

        const properties_7 = this.getPlayerProperty(
            5, 5, 5, 5, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15
        );

        const player_2 = await this.insertPlayer(
            inventory_5, properties_7, level_4._id,
            'log', 'pas', 'f1', 's2', 't3', 'f1s2t3@email.com',
            [], [],
        );

        // insert map

        const mapPoint_1 = this.getSpawnPoint(1, [1, 0, 9], true, false);
        const mapPoint_2 = this.getSpawnPoint(2, [2, 0, 8], false, true);
        const mapPoint_3 = this.getTeleportPoint(3, [3, 0, 7], 5, 4);
        const mapPoint_4 = this.getTeleportPoint(4, [4, 0, 6], 3, 5);
        const mapPoint_5 = this.getTeleportPoint(5, [5, 0, 5], 4, 3);
        const mapPoint_6 = this.getNonePoint(6, [6, 0, 4]);
        const mapPoint_7 = this.getNonePoint(7, [7, 0, 3]);
        const mapPoint_8 = this.getNonePoint(8, [8, 0, 2]);
        const mapPoint_9 = this.getNonePoint(9, [9, 0, 1]);

        const map_1 = await this.insertMap('1', 'первая карта', [
            mapPoint_1, mapPoint_2, mapPoint_3, mapPoint_4, mapPoint_5,
            mapPoint_6, mapPoint_7, mapPoint_8, mapPoint_9,
        ]);

        // insert game

        const waves = [
            { enemy_id: enemy_1._id, count: 2, spawn_moment: 0 } as SpawnScriptEnemy,
            { enemy_id: enemy_1._id, count: 4, spawn_moment: 25 } as SpawnScriptEnemy,
            { enemy_id: enemy_1._id, count: 2, spawn_moment: 50 } as SpawnScriptEnemy,
            { enemy_id: enemy_1._id, count: 4, spawn_moment: 75 } as SpawnScriptEnemy,
        ]

        const script_1 = await this.insertSpawnScript(
            'сценарий одной волны врагов', waves,
        );

        const game_1 = await this.insertGame(
            map_1.id, script_1.id, player_1.id,
        );

        return {
            skills: [skill_1, skill_2, skill_3],
            products: [product_1, product_2, product_3],
            levels: [level_1, level_2, level_3, level_4],
            enemies: [enemy_1],
            players: [player_1, player_2],
            maps: [map_1],
            scripts: [script_1],
            games: [game_1],
        };
    }

    // find

    async testFind() {
        const skillResult = await this.skillModel.find();
        const levelTemplateResult = await this.levelTemplateModel.find();
        const productResult = await this.productModel.find();
        const playerResult = await this.playerModel.find();
        const enemyResult = await this.enemyModel.find();
        const gameResult = await this.gameModel.find();
        const spawnScriptResult = await this.spawnScriptModel.find();
        const mapResult = await this.mapModel.find();

        return {
            skillResult, levelTemplateResult, productResult,
            playerResult, enemyResult, gameResult,
            spawnScriptResult, mapResult,
        }
    }

    // delete all

    async testDelete() {
        const skillResult = await this.skillModel.deleteMany();
        const levelTemplateResult = await this.levelTemplateModel.deleteMany();
        const productResult = await this.productModel.deleteMany();
        const playerResult = await this.playerModel.deleteMany();
        const enemyResult = await this.enemyModel.deleteMany();
        const gameResult = await this.gameModel.deleteMany();
        const spawnScriptResult = await this.spawnScriptModel.deleteMany();
        const mapResult = await this.mapModel.deleteMany();

        return {
            skillResult, levelTemplateResult, productResult,
            playerResult, enemyResult, gameResult,
            spawnScriptResult, mapResult,
        }
    }
}
