import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, TreeLevelColumn } from 'typeorm';
//
import { PlayerProperty } from './entity/PlayerProperty';
import { Requirement } from './entity/Requirement';
import { Skill } from './entity/Skill';
import { Inventory } from './entity/Inventory';
import { LevelTemplate } from './entity/LevelTemplate';
import { LevelTemplateSkill } from './entity/LevelTemplateSkill';
import { Player } from './entity/Player';
import { Enemy } from './entity/Enemy';
import { LevelEffect } from './entity/LevelEffect';
import { PlayerSkill } from './entity/PlayerSkill';
import { Product } from './entity/Product';
import { ProductSkill } from './entity/ProductSkill';
import { ProductWeapon } from './entity/ProductWeapon';
import { ProductCloth } from './entity/ProductCloth';
import { ProductShell } from './entity/ProductShell';
import { WeaponShell } from './entity/WeaponShell';
import { InventoryProduct } from './entity/InventoryProduct';
import { Map } from './entity/Map';
import { ActivityPoint } from './entity/ActivityPoint';
import { MapPoint } from './entity/MapPoint';
import { SpawnScript } from './entity/SpawnScript';
import { SpawnScriptEnemy } from './entity/SpawnScriptEnemy';
import { Game } from './entity/Game';
import { GameEnemy } from './entity/GameEnemy';
import { GamePlayer } from './entity/GamePlayer';

//
@Injectable()
export class PostgresService {
    constructor(
        @InjectDataSource('postgres_db') private dataSource: DataSource,
    ) {

        ((async function (dataSource: DataSource) {

            // PlayerProperty
            await dataSource.getRepository(PlayerProperty).find({
                relations: {
                    enemy: true,
                    levelTemplate: true,
                    player: true,
                }
            }).then((items) => {
                console.log('--- PlayerProperty --- ', items[0]);
                console.log('--- PlayerProperty -> Enemy --- ', items[0].enemy);
                console.log('--- PlayerProperty -> LevelTemplate --- ', items[0].levelTemplate);
                console.log('--- PlayerProperty -> Player --- ', items[0].player);
            });

            // Requirement
            await dataSource.getRepository(Requirement).find({
                relations: {
                    products: true,
                    skills: true,
                }
            }).then((items) => {
                console.log('--- Requirement --- ', items[0]);
                console.log('--- Requirement -> Product --- ', items[0].products);
                console.log('--- Requirement -> Skill --- ', items[0].skills);
            });

            // Skill
            await dataSource.getRepository(Skill).find({
                relations: {
                    requirement: true,
                    parentSkill: true,
                    products: true,
                    childSkills: true,
                    players: true,
                    levelTemplates: true,
                }
            }).then((items) => {
                console.log('--- Skill --- ', items[0]);
                console.log('--- Skill -> ParentSkill --- ', items[0].parentSkill);
                console.log('--- Skill -> ChildSkills --- ', items[0].childSkills);
                console.log('--- Skill -> Requirement --- ', items[0].requirement);
                console.log('--- Skill -> Product --- ', items[0].products);
                console.log('--- Skill -> Player --- ', items[0].players);
                console.log('--- Skill -> LevelTemplate --- ', items[0].levelTemplates);
            });

            // Inventory
            await dataSource.getRepository(Inventory).find({
                relations: {
                    enemy: true,
                    levelTemplate: true,
                    products: true,
                    player: true,
                }
            }).then((items) => {
                console.log('--- Inventory --- ', items[0]);
                console.log('--- Inventory -> Enemy --- ', items[0].enemy);
                console.log('--- Inventory -> LevelTemplate --- ', items[0].levelTemplate);
                console.log('--- Inventory -> Product --- ', items[0].products);
                console.log('--- Inventory -> Player --- ', items[0].player);
            });

            // LevelTemplate
            await dataSource.getRepository(LevelTemplate).find({
                relations: {
                    playerProperty: true,
                    inventory: true,
                    enemy: true,
                    player: true,
                    skills: true,
                }
            }).then((items) => {
                console.log('--- LevelTemplate --- ', items[0]);
                console.log('--- LevelTemplate -> PlayerProperty --- ', items[0].playerProperty);
                console.log('--- LevelTemplate -> Inventory --- ', items[0].inventory);
                console.log('--- LevelTemplate -> Enemy --- ', items[0].enemy);
                console.log('--- LevelTemplate -> Player --- ', items[0].player);
                console.log('--- LevelTemplate -> Skill --- ', items[0].skills);
            });

            // LevelTemplateSkill
            await dataSource.getRepository(LevelTemplateSkill).find({
                relations: {
                    levelTemplate: { skills: true },
                    skill: { levelTemplates: true },
                }
            }).then((items) => {
                console.log('--- LevelTemplateSkill --- ', items[0]);
                console.log('--- LevelTemplateSkill -> LevelTemplate --- ', items[0].levelTemplate.skills);
                console.log('--- LevelTemplateSkill -> Skill --- ', items[0].skill.levelTemplates);
            });

            // Player
            await dataSource.getRepository(Player).find({
                relations: {
                    inventory: true,
                    playerProperty: true,
                    levelTemplate: true,
                    effects: true,
                    games: true,
                    skills: true,
                }
            }).then((items) => {
                console.log('--- Player --- ', items[0]);
                console.log('--- Player -> Inventory --- ', items[0].inventory);
                console.log('--- Player -> PlayerProperty --- ', items[0].playerProperty);
                console.log('--- Player -> LevelTemplate --- ', items[0].levelTemplate);
                console.log('--- Player -> Effect --- ', items[0].effects);
                console.log('--- Player -> Game --- ', items[0].games);
                console.log('--- Player -> Skill --- ', items[0].skills);
            });

            // Enemy
            await dataSource.getRepository(Enemy).find({
                relations: {
                    inventory: true,
                    playerProperty: true,
                    levelTemplate: true,
                    games: true,
                    scripts: true,
                }
            }).then((items) => {
                console.log('--- Enemy --- ', items[0]);
                console.log('--- Enemy -> Inventory --- ', items[0].inventory);
                console.log('--- Enemy -> PlayerProperty --- ', items[0].playerProperty);
                console.log('--- Enemy -> LevelTemplate --- ', items[0].levelTemplate);
                console.log('--- Enemy -> Game --- ', items[0].games);
                console.log('--- Enemy -> SpawnScriptEnemy --- ', items[0].scripts);
            });

            // LevelEffect
            await dataSource.getRepository(LevelEffect).find({
                relations: {
                    player: true,
                }
            }).then((items) => {
                console.log('--- LevelEffect --- ', items[0]);
                console.log('--- LevelEffect -> Player --- ', items[0].player);
            });

            // PlayerSkill
            await dataSource.getRepository(PlayerSkill).find({
                relations: {
                    player: { skills: true },
                    skill: { players: true },
                }
            }).then((items) => {
                console.log('--- PlayerSkill --- ', items[0]);
                console.log('--- PlayerSkill -> Player --- ', items[0].player.skills);
                console.log('--- PlayerSkill -> Skill --- ', items[0].skill.players);
            });

            // Product
            await dataSource.getRepository(Product).find({
                relations: {
                    requirement: true,
                    productCloth: true,
                    productShell: true,
                    productWeapon: true,
                    skills: true,
                    inventories: true,
                }
            }).then((items) => {
                console.log('--- Product --- ', items[0]);
                console.log('--- Product -> Requirement --- ', items[0].requirement);
                console.log('--- Product -> ProductCloth --- ', items[0].productCloth);
                console.log('--- Product -> ProductShell --- ', items[0].productShell);
                console.log('--- Product -> ProductWeapon --- ', items[0].productWeapon);
                console.log('--- Product -> ProductSkill --- ', items[0].skills);
                console.log('--- Product -> InventoryProduct --- ', items[0].inventories);
            });

            // ProductSkill
            await dataSource.getRepository(ProductSkill).find({
                relations: {
                    product: { skills: true },
                    skill: { products: true },
                }
            }).then((items) => {
                console.log('--- PlayerSkill --- ', items[0]);
                console.log('--- PlayerSkill -> Product --- ', items[0].product.skills);
                console.log('--- PlayerSkill -> Skill --- ', items[0].skill.products);
            });

            // ProductWeapon
            await dataSource.getRepository(ProductWeapon).find({
                relations: {
                    product: true,
                    shells: true,
                }
            }).then((items) => {
                console.log('--- ProductWeapon --- ', items[0]);
                console.log('--- ProductWeapon -> Product --- ', items[0].product);
                console.log('--- ProductWeapon -> WeaponShell --- ', items[0].shells);
            });

            // ProductCloth
            await dataSource.getRepository(ProductCloth).find({
                relations: {
                    product: true,
                }
            }).then((items) => {
                console.log('--- ProductCloth --- ', items[0]);
                console.log('--- ProductCloth -> Product --- ', items[0].product);
            });

            // ProductShell
            await dataSource.getRepository(ProductShell).find({
                relations: {
                    product: true,
                    weapons: true,
                }
            }).then((items) => {
                console.log('--- ProductShell --- ', items[0]);
                console.log('--- ProductShell -> Product --- ', items[0].product);
                console.log('--- ProductShell -> WeaponShell --- ', items[0].weapons);
            });

            // WeaponShell
            await dataSource.getRepository(WeaponShell).find({
                relations: {
                    productWeapon: { shells: true },
                    productShell: { weapons: true },
                }
            }).then((items) => {
                console.log('--- WeaponShell --- ', items[0]);
                console.log('--- WeaponShell -> ProductWeapon --- ', items[0].productWeapon.shells);
                console.log('--- WeaponShell -> ProductShell --- ', items[0].productShell.weapons);
            });

            // InventoryProduct
            await dataSource.getRepository(InventoryProduct).find({
                relations: {
                    inventory: { products: true },
                    product: { inventories: true },
                }
            }).then((items) => {
                console.log('--- InventoryProduct --- ', items[0]);
                console.log('--- InventoryProduct -> Inventory --- ', items[0].inventory.products);
                console.log('--- InventoryProduct -> Product --- ', items[0].product.inventories);
            });

            // Map
            await dataSource.getRepository(Map).find({
                relations: {
                    points: true,
                    game: true,
                }
            }).then((items) => {
                console.log('--- Map --- ', items[0]);
                console.log('--- Map -> MapPoint --- ', items[0].points);
                console.log('--- Map -> Game --- ', items[0].game);
            });

            // ActivityPoint
            await dataSource.getRepository(ActivityPoint).find({
                relations: {
                    maps: true,
                }
            }).then((items) => {
                console.log('--- ActivityPoint --- ', items[0]);
                console.log('--- ActivityPoint -> MapPoint --- ', items[0].maps);
            });

            // MapPoint
            await dataSource.getRepository(MapPoint).find({
                relations: {
                    map: { points: true },
                    point: { maps: true },
                }
            }).then((items) => {
                console.log('--- MapPoint --- ', items[0]);
                console.log('--- MapPoint -> Map --- ', items[0].map.points);
                console.log('--- MapPoint -> ActivityPoint --- ', items[0].point.maps);
            });

            // SpawnScript
            await dataSource.getRepository(SpawnScript).find({
                relations: {
                    game: true,
                    enemies: true,
                }
            }).then((items) => {
                console.log('--- SpawnScript --- ', items[0]);
                console.log('--- SpawnScript -> Game --- ', items[0].game);
                console.log('--- SpawnScript -> SpawnScriptEnemy --- ', items[0].enemies);
            });

            // SpawnScriptEnemy
            await dataSource.getRepository(SpawnScriptEnemy).find({
                relations: {
                    spawnScript: { enemies: true },
                    enemy: { scripts: true },
                }
            }).then((items) => {
                console.log('--- SpawnScriptEnemy --- ', items[0]);
                console.log('--- SpawnScriptEnemy -> SpawnScript --- ', items[0].spawnScript.enemies);
                console.log('--- SpawnScriptEnemy -> Enemy --- ', items[0].enemy.scripts);
            });

            // Game
            await dataSource.getRepository(Game).find({
                relations: {
                    map: true,
                    spawnScript: true,
                    enemies: true,
                    players: true,
                }
            }).then((items) => {
                console.log('--- Game --- ', items[0]);
                console.log('--- Game -> Map --- ', items[0].map);
                console.log('--- Game -> SpawnScript --- ', items[0].spawnScript);
                console.log('--- Game -> GameEnemy --- ', items[0].enemies);
                console.log('--- Game -> GamePlayer --- ', items[0].players);
            });

            // GameEnemy
            await dataSource.getRepository(GameEnemy).find({
                relations: {
                    game: { enemies: true },
                    enemy: { games: true },
                }
            }).then((items) => {
                console.log('--- GameEnemy --- ', items[0]);
                console.log('--- GameEnemy -> Game --- ', items[0].game.enemies);
                console.log('--- GameEnemy -> Enemy --- ', items[0].enemy.games);
            });

            // GamePlayer
            await dataSource.getRepository(GamePlayer).find({
                relations: {
                    game: { players: true },
                    player: { games: true },
                }
            }).then((items) => {
                console.log('--- GamePlayer --- ', items[0]);
                console.log('--- GamePlayer -> Game --- ', items[0].game.players);
                console.log('--- GamePlayer -> Player --- ', items[0].player.games);
            });

        })(this.dataSource));
    }
}
