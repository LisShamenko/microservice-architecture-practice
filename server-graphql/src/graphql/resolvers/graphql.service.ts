import { Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { PaginatorArgs } from 'nestjs-graphql-tools';
// 
import { ActivityPoint } from '../../modules/Postgres/entity/ActivityPoint';
import { ActivitySpawn } from '../../modules/Postgres/entity/ActivitySpawn';
import { ActivityTeleport } from '../../modules/Postgres/entity/ActivityTeleport';
import { Enemy } from '../../modules/Postgres/entity/Enemy';
import { EnemySkill } from '../../modules/Postgres/entity/EnemySkill';
import { Game } from '../../modules/Postgres/entity/Game';
import { GamePlayer } from '../../modules/Postgres/entity/GamePlayer';
import { Inventory } from '../../modules/Postgres/entity/Inventory';
import { InventoryProduct } from '../../modules/Postgres/entity/InventoryProduct';
import { LevelEffect } from '../../modules/Postgres/entity/LevelEffect';
import { LevelTemplate } from '../../modules/Postgres/entity/LevelTemplate';
import { LevelTemplateSkill } from '../../modules/Postgres/entity/LevelTemplateSkill';
import { Map } from '../../modules/Postgres/entity/Map';
import { MapPoint } from '../../modules/Postgres/entity/MapPoint';
import { Player } from '../../modules/Postgres/entity/Player';
import { PlayerProperty } from '../../modules/Postgres/entity/PlayerProperty';
import { ProductCloth } from '../../modules/Postgres/entity/ProductCloth';
import { ProductShell } from '../../modules/Postgres/entity/ProductShell';
import { ProductWeapon } from '../../modules/Postgres/entity/ProductWeapon';
import { PlayerSkill } from '../../modules/Postgres/entity/PlayerSkill';
import { Product } from '../../modules/Postgres/entity/Product';
import { ProductSkill } from '../../modules/Postgres/entity/ProductSkill';
import { Requirement } from '../../modules/Postgres/entity/Requirement';
import { Skill } from '../../modules/Postgres/entity/Skill';
import { SpawnScript } from '../../modules/Postgres/entity/SpawnScript';
import { SpawnScriptEnemy } from '../../modules/Postgres/entity/SpawnScriptEnemy';
import { TestModel } from '../../modules/Postgres/entity/TestModel';
import { User } from '../../modules/Postgres/entity/User';
import { UserFile } from '../../modules/Postgres/entity/UserFile';
import { WeaponShell } from '../../modules/Postgres/entity/WeaponShell';
import { ActivityPointTypes } from '../../modules/Postgres/enums/ActivityPointTypes';
//
import { LevelTemplateObject } from './LevelTemplate/level-template.objects';
import { MapPointObject, SpawnObject, TeleportObject } from './Map/map.objects';
import { LevelEffectObject, PlayerObject } from './Player/player.objects';
import { InventoryObject, InventoryProductObject, ProductClothObject, ProductShellObject, ProductWeaponObject } from './Product/product.objects';
import { SkillObject } from './Skill/skill.objects';
import { PlayerPropertyObject, RequirementObject } from './graphql.objects';
import { SpawnScriptEnemyObject } from './Spawn/spawn.objects';
import { EnemyObject } from './Enemy/enemy.objects';



// 
@Injectable()
export class GraphQLService {

    private repoActivityPoint: Repository<ActivityPoint>;
    private repoActivitySpawn: Repository<ActivitySpawn>;
    private repoActivityTeleport: Repository<ActivityTeleport>;
    private repoEnemy: Repository<Enemy>;
    private repoEnemySkill: Repository<EnemySkill>;
    private repoGame: Repository<Game>;
    private repoGamePlayer: Repository<GamePlayer>;
    private repoInventory: Repository<Inventory>;
    private repoInventoryProduct: Repository<InventoryProduct>;
    private repoLevelEffect: Repository<LevelEffect>;
    private repoLevelTemplate: Repository<LevelTemplate>;
    private repoLevelTemplateSkill: Repository<LevelTemplateSkill>;
    private repoMap: Repository<Map>;
    private repoMapPoint: Repository<MapPoint>;
    private repoPlayer: Repository<Player>;
    private repoPlayerProperty: Repository<PlayerProperty>;
    private repoPlayerSkill: Repository<PlayerSkill>;
    private repoProduct: Repository<Product>;
    private repoProductCloth: Repository<ProductCloth>;
    private repoProductShell: Repository<ProductShell>;
    private repoProductSkill: Repository<ProductSkill>;
    private repoProductWeapon: Repository<ProductWeapon>;
    private repoRequirement: Repository<Requirement>;
    private repoSkill: Repository<Skill>;
    private repoSpawnScript: Repository<SpawnScript>;
    private repoSpawnScriptEnemy: Repository<SpawnScriptEnemy>;
    private repoTestModel: Repository<TestModel>;
    private repoUser: Repository<User>;
    private repoUserFile: Repository<UserFile>;
    private repoWeaponShell: Repository<WeaponShell>;

    constructor(private sequelize: Sequelize) {
        this.repoActivityPoint = this.sequelize.getRepository(ActivityPoint);
        this.repoActivitySpawn = this.sequelize.getRepository(ActivitySpawn);
        this.repoActivityTeleport = this.sequelize.getRepository(ActivityTeleport);
        this.repoEnemy = this.sequelize.getRepository(Enemy);
        this.repoEnemySkill = this.sequelize.getRepository(EnemySkill);
        this.repoGame = this.sequelize.getRepository(Game);
        this.repoGamePlayer = this.sequelize.getRepository(GamePlayer);
        this.repoInventory = this.sequelize.getRepository(Inventory);
        this.repoInventoryProduct = this.sequelize.getRepository(InventoryProduct);
        this.repoLevelEffect = this.sequelize.getRepository(LevelEffect);
        this.repoLevelTemplate = this.sequelize.getRepository(LevelTemplate);
        this.repoLevelTemplateSkill = this.sequelize.getRepository(LevelTemplateSkill);
        this.repoMap = this.sequelize.getRepository(Map);
        this.repoMapPoint = this.sequelize.getRepository(MapPoint);
        this.repoPlayer = this.sequelize.getRepository(Player);
        this.repoPlayerProperty = this.sequelize.getRepository(PlayerProperty);
        this.repoPlayerSkill = this.sequelize.getRepository(PlayerSkill);
        this.repoProduct = this.sequelize.getRepository(Product);
        this.repoProductCloth = this.sequelize.getRepository(ProductCloth);
        this.repoProductShell = this.sequelize.getRepository(ProductShell);
        this.repoProductSkill = this.sequelize.getRepository(ProductSkill);
        this.repoProductWeapon = this.sequelize.getRepository(ProductWeapon);
        this.repoRequirement = this.sequelize.getRepository(Requirement);
        this.repoSkill = this.sequelize.getRepository(Skill);
        this.repoSpawnScript = this.sequelize.getRepository(SpawnScript);
        this.repoSpawnScriptEnemy = this.sequelize.getRepository(SpawnScriptEnemy);
        this.repoTestModel = this.sequelize.getRepository(TestModel);
        this.repoUser = this.sequelize.getRepository(User);
        this.repoUserFile = this.sequelize.getRepository(UserFile);
        this.repoWeaponShell = this.sequelize.getRepository(WeaponShell);
    }

    //
    async findInventories(ids: number | number[]) {
        const result = await this.repoInventory.findAll({
            where: { id: ids }
        });

        return result.map<InventoryObject>(m => ({
            id: m.id,
            sorting: m.sorting,
        }))
    }

    async findRequirement(requirement_ids: number | number[]): Promise<RequirementObject[]> {
        return await this.repoRequirement.findAll({
            where: { id: requirement_ids }
        });
    }

    async findProperties(ids: number | number[]): Promise<PlayerPropertyObject[]> {
        return await this.repoPlayerProperty.findAll({
            where: { id: ids }
        });
    }

    async findLevelTemplates(ids: number | number[]): Promise<LevelTemplateObject[]> {
        return await this.repoLevelTemplate.findAll({
            where: { id: ids }
        });
    }

    async findProductSkills(product_ids: number | number[]): Promise<SkillObject[]> {
        const result = await this.repoProductSkill.findAll({
            where: { product_id: product_ids },
            include: ['skill'],
        });

        return result.map<SkillObject>(r => ({
            product_id: r.product_id,
            id: r.skill_id,
            title: r.skill.title,
        }));
    }

    async findEnemySkills(enemy_ids: number | number[]): Promise<SkillObject[]> {
        const result = await this.repoEnemySkill.findAll({
            where: { enemy_id: enemy_ids },
            include: ['skill'],
        });

        return result.map<SkillObject>(r => ({
            enemy_id: r.enemy_id,
            id: r.skill_id,
            title: r.skill.title,
        }));
    }

    async findTemplateSkills(enemy_ids: number | number[]): Promise<SkillObject[]> {
        const result = await this.repoLevelTemplateSkill.findAll({
            where: { level_template_id: enemy_ids },
            include: ['skill'],
        });

        return result.map<SkillObject>(r => ({
            level_template_id: r.level_template_id,
            id: r.skill_id,
            title: r.skill.title,
        }));
    }

    async findPlayerSkills(player_ids: number | number[]): Promise<SkillObject[]> {
        const result = await this.repoPlayerSkill.findAll({
            where: { player_id: player_ids },
            include: ['skill'],
        });

        return result.map<SkillObject>(r => ({
            player_id: r.player_id,
            id: r.skill_id,
            title: r.skill.title,
        }));
    }

    async findChildSkills(parent_skill_ids: number | number[]): Promise<SkillObject[]> {
        const result = await this.repoSkill.findAll({
            where: { parent_skill_id: parent_skill_ids },
        });

        return result.map<SkillObject>(r => ({
            id: r.id,
            title: r.title,
            requirement_id: r.requirement_id,
            parent_skill_id: r.parent_skill_id,
        }));
    }

    async findParentSkills(skill_ids: number | number[]): Promise<SkillObject[]> {
        const result = await this.repoSkill.findAll({
            where: { id: skill_ids },
            include: ['parentSkill'],
        });

        return result.map<SkillObject>(r => r.parentSkill
            ? ({
                id: r.parentSkill.id,
                title: r.parentSkill.title,
                requirement_id: r.parentSkill.requirement_id,
                parent_skill_id: r.parentSkill.parent_skill_id,
                child_id: r.id,
            })
            : null
        );
    }

    async findPlayerEffects(player_ids: number | number[]): Promise<LevelEffectObject[]> {
        const result = await this.repoLevelEffect.findAll({
            where: { player_id: player_ids },
        });

        return result.map<LevelEffectObject>(r => ({
            id: r.id,
            count_matches: r.count_matches,
            is_equipment: r.is_equipment,
            property_column: r.property_column,
            delta_value: r.delta_value,
            player_id: r.player_id,
        }));
    }

    async findMap(map_ids: number | number[]) {
        return await this.repoMap.findAll({
            where: { id: map_ids }
        });
    }

    async findSpawnScript(spawn_script_ids: number | number[]) {
        return await this.repoSpawnScript.findAll({
            where: { id: spawn_script_ids }
        });
    }

    async findPlayer(player_ids: number | number[]) {
        return await this.repoPlayer.findAll({
            where: { id: player_ids }
        });
    }

    async findPlayers(game_ids: number | number[]) {
        const result = await this.repoGamePlayer.findAll({
            where: { game_id: game_ids },
            include: ['player'],
        });

        return result.map<PlayerObject>(r => ({
            game_id: r.game_id,
            id: r.player.id,
            login: r.player.login,
            password: r.player.password,
            firstname: r.player.firstname,
            secondname: r.player.secondname,
            thirdname: r.player.thirdname,
            email: r.player.email,
        }));
    }

    async findPoints(map_ids: number | number[], types?: ActivityPointTypes[]) {
        const include = (types)
            ? [{
                association: 'activityPoint',
                where: { pointType: types },
            }]
            : ['activityPoint'];

        const result = await this.repoMapPoint.findAll({
            where: { map_id: map_ids },
            include: include,
        });

        return result.map<MapPointObject>(m => ({
            point_id: m.id,
            activity_id: m.activityPoint
                ? m.activityPoint.id : null,
            map_id: m.map_id,
            position: m.position,
            pointType: m.activityPoint
                ? m.activityPoint.pointType : ActivityPointTypes.none,
        }))
    }

    async findSpawns(activity_ids: number | number[]) {
        const result = await this.repoActivitySpawn.findAll({
            where: { activity_id: activity_ids }
        });

        return result.map<SpawnObject>(m => ({
            id: m.id,
            activity_id: m.activity_id,
            is_player: m.is_player,
            is_enemy: m.is_enemy,
        }))
    }

    async findTeleport(activity_ids: number | number[]) {
        const result = await this.repoActivityTeleport.findAll({
            where: { activity_id: activity_ids }
        });

        return result.map<TeleportObject>(m => ({
            id: m.activity_id,
            activity_id: m.activity_id,
            next_id: m.next_activity_id,
            prev_id: m.prev_activity_id,
        }))
    }

    async findProducts(inventory_ids: number | number[]) {
        const result = await this.repoInventoryProduct.findAll({
            where: { inventory_id: inventory_ids },
            include: ['product'],
        });

        return result.map<InventoryProductObject>(r => ({
            id: r.product.id,
            title: r.product.title,
            price: r.product.price,
            max_in_slot: r.product.max_in_slot,
            product_type: r.product.product_type,
            count_in_all_slots: r.count_in_all_slots,
            inventory_id: r.inventory_id,
        }));
    }

    async findProductCloth(product_ids: number | number[]) {
        const result = await this.repoProductCloth.findAll({
            where: { product_id: product_ids },
        });

        return result.map<ProductClothObject>(r => ({
            id: r.id,
            product_id: r.product_id,
        }));
    }

    async findProductShell(product_ids: number | number[]) {
        const result = await this.repoProductShell.findAll({
            where: { product_id: product_ids },
        });

        return result.map<ProductShellObject>(r => ({
            id: r.id,
            product_id: r.product_id,
        }));
    }

    async findProductWeapon(product_ids: number | number[]) {
        const result = await this.repoProductWeapon.findAll({
            where: { product_id: product_ids },
        });

        return result.map<ProductWeaponObject>(r => ({
            id: r.id,
            product_id: r.product_id,
        }));
    }

    async findShells(weapon_ids: number | number[]) {
        const result = await this.repoWeaponShell.findAll({
            where: { weapon_id: weapon_ids },
            include: ['productShell'],
        });

        return result.map<ProductShellObject>(r => ({
            id: r.id,
            product_id: r.shell_id,
            weapon_id: r.weapon_id,
        }));
    }

    async findWeapons(shell_ids: number | number[]) {
        const result = await this.repoWeaponShell.findAll({
            where: { shell_id: shell_ids },
            include: ['productWeapon'],
        });

        return result.map<ProductShellObject>(r => ({
            id: r.id,
            product_id: r.weapon_id,
            shell_id: r.shell_id,
        }));
    }

    async findSpawnScriptEnemy(spawn_script_ids: number | number[]) {
        const result = await this.repoSpawnScriptEnemy.findAll({
            where: { script_id: spawn_script_ids },
        });

        return result.map<SpawnScriptEnemyObject>(r => ({
            id: r.id,
            count: r.count,
            spawn_moment: r.spawn_moment,
            enemy_id: r.enemy_id,
            script_id: r.script_id,
        }));
    }

    async findEnemy(spawn_enemy_ids: number | number[]) {
        const result = await this.repoSpawnScriptEnemy.findAll({
            where: { id: spawn_enemy_ids },
            include: ['enemy'],
        });

        return result.map<EnemyObject>(r => ({
            id: r.enemy.id,
            enemy_type: r.enemy.enemy_type,
            nickname: r.enemy.nickname,
            inventory_id: r.enemy.inventory_id,
            properties_id: r.enemy.properties_id,
            level_template_id: r.enemy.level_template_id,
            spawn_enemy_id: r.id,
        }));
    }
}
