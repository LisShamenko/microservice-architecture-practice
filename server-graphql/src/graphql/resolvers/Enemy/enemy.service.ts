import { Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { PaginatorArgs } from 'nestjs-graphql-tools';
// 
import { Enemy } from '../../../modules/Postgres/entity/Enemy';
import { Inventory } from '../../../modules/Postgres/entity/Inventory';
import { InventoryProduct } from '../../../modules/Postgres/entity/InventoryProduct';
import { EnemySkill } from '../../../modules/Postgres/entity/EnemySkill';
import { PlayerProperty } from '../../../modules/Postgres/entity/PlayerProperty';
import { Sorting } from '../../../modules/Postgres/enums/Sorting';
import { LevelTemplate } from '../../../modules/Postgres/entity/LevelTemplate';
import { SpawnScriptEnemy } from '../../../modules/Postgres/entity/SpawnScriptEnemy';
import { ErrorHelper } from '../services/ErrorHelper';
import { TemplateHelper } from '../services/TemplateHelper';
import { ProductHelper } from '../services/ProductHelper';
import { PropertyHelper } from '../services/PropertyHelper';
import { SkillHelper } from '../services/SkillHelper';
import { EnemyObject, NewEnemyInput, UpdateEnemyInput } from './enemy.objects';



// 
@Injectable()
export class EnemyService {
    private repoEnemy: Repository<Enemy>;
    private repoInventoryProduct: Repository<InventoryProduct>;
    private repoEnemySkill: Repository<EnemySkill>;
    private repoInventory: Repository<Inventory>;
    private repoPlayerProperty: Repository<PlayerProperty>;
    private repoLevelTemplate: Repository<LevelTemplate>;
    private repoSpawnScriptEnemy: Repository<SpawnScriptEnemy>;


    constructor(
        private sequelize: Sequelize,
        private errorHelper: ErrorHelper,
        private templateHelper: TemplateHelper,
        private productHelper: ProductHelper,
        private propertyHelper: PropertyHelper,
        private skillHelper: SkillHelper,
    ) {
        this.repoEnemy = this.sequelize.getRepository(Enemy);
        this.repoInventoryProduct = this.sequelize.getRepository(InventoryProduct);
        this.repoEnemySkill = this.sequelize.getRepository(EnemySkill);
        this.repoInventory = this.sequelize.getRepository(Inventory);
        this.repoPlayerProperty = this.sequelize.getRepository(PlayerProperty);
        this.repoLevelTemplate = this.sequelize.getRepository(LevelTemplate);
        this.repoSpawnScriptEnemy = this.sequelize.getRepository(SpawnScriptEnemy);

    }

    // 
    async insertEnemy(idto: NewEnemyInput) {

        const { tmpProperties, tmpProducts, tmpSkills } =
            await this.templateHelper.getEnemyTemplate(idto.level_template_id);

        this.propertyHelper.deltaProperties(tmpProperties, idto.delta_properties);
        await this.productHelper.refillProducts(tmpProducts, idto.products);
        await this.skillHelper.refillEnemySkills(tmpSkills, idto.skills);

        // 
        const inventory = new Inventory();
        inventory.sorting = Sorting.none;

        const enemy = new Enemy();
        enemy.enemy_type = idto.enemy_type;
        enemy.nickname = idto.nickname;
        enemy.level_template_id = idto.level_template_id;

        // 
        const t = await this.sequelize.transaction();
        try {

            await tmpProperties.save({ transaction: t });
            enemy.properties_id = tmpProperties.id;

            await inventory.save({ transaction: t });
            enemy.inventory_id = inventory.id;

            if (tmpProducts.length > 0) {
                for (const p of tmpProducts) {
                    p.inventory_id = inventory.id;
                    await p.save({ transaction: t });
                }
            }

            await enemy.save({ transaction: t });

            if (tmpSkills.length > 0) {
                for (const s of tmpSkills) {
                    s.enemy_id = enemy.id;
                    await s.save({ transaction: t });
                }
            }

            await t.commit();
            return enemy;
        }
        catch (err) {
            await t.rollback();
            this.errorHelper.transactionError(err.message);
        }
    }

    async updateEnemy(udto: UpdateEnemyInput) {

        const enemy = await this.repoEnemy.findOne({
            where: { id: udto.enemy_id },
            include: [
                { association: 'playerProperty' },
                { association: 'inventory', include: ['linkInventoryProduct'] },
                { association: 'linkEnemySkill' },
            ],
        });
        this.errorHelper.foundError(enemy, 'enemy_id');

        // 
        let addProducts: InventoryProduct[] = [];
        let removeProducts: InventoryProduct[] = [];
        let addSkills: EnemySkill[] = [];
        let removeSkills: EnemySkill[] = [];

        // 
        if (udto.reset_template_id &&
            udto.reset_template_id !== enemy.level_template_id
        ) {
            enemy.level_template_id = udto.reset_template_id;

            const { tmpProperties, tmpProducts, tmpSkills } =
                await this.templateHelper.getEnemyTemplate(udto.reset_template_id);

            this.propertyHelper.deltaProperties(tmpProperties, udto.delta_properties);
            this.propertyHelper.copyProperties(enemy.playerProperty, tmpProperties);

            await this.productHelper.refillProducts(tmpProducts, udto.products);
            await this.skillHelper.refillEnemySkills(tmpSkills, udto.skills);

            // 
            addProducts = tmpProducts.filter(p => p.count_in_all_slots > 0);
            removeProducts = enemy.inventory.linkInventoryProduct;
            addSkills = tmpSkills;
            removeSkills = enemy.linkEnemySkill;
        }
        else {

            this.propertyHelper.deltaProperties(enemy.playerProperty, udto.delta_properties);

            const tmpProducts = enemy.inventory.linkInventoryProduct;
            await this.productHelper.refillProducts(tmpProducts, udto.products);

            const tmpSkills = enemy.linkEnemySkill;
            removeSkills = this.skillHelper.filterSkills(tmpSkills, udto.skills);
            await this.skillHelper.refillEnemySkills(tmpSkills, udto.skills);

            //
            addProducts = tmpProducts.filter(p => p.count_in_all_slots > 0);
            removeProducts = tmpProducts.filter(p => (
                (p.id >= 0) && p.count_in_all_slots <= 0
            ));
            addSkills = tmpSkills;
        }

        // 
        if (udto.enemy_type) enemy.enemy_type = udto.enemy_type;
        if (udto.nickname) enemy.nickname = udto.nickname;

        // 
        const t = await this.sequelize.transaction();
        try {

            await this.repoInventoryProduct.destroy({
                where: { id: removeProducts.map(p => p.id) },
                transaction: t,
            });
            if (addProducts.length > 0) {
                for (const p of addProducts) {
                    p.inventory_id = enemy.inventory.id;
                    await p.save({ transaction: t });
                }
            }

            await this.repoEnemySkill.destroy({
                where: { id: removeSkills.map(s => s.id) },
                transaction: t,
            });
            if (addSkills.length > 0) {
                for (const s of addSkills) {
                    s.enemy_id = enemy.id;
                    await s.save({ transaction: t });
                }
            }

            await enemy.playerProperty.save();
            await enemy.save({ transaction: t });

            await t.commit();
        }
        catch (err) {
            await t.rollback();
            this.errorHelper.transactionError(err.message);
        }
        return enemy;
    }

    async getOneEnemy(enemy_id: number): Promise<EnemyObject> {
        return await this.repoEnemy.findOne({ where: { id: enemy_id } });
    }

    async getAllEnemies(paginator: PaginatorArgs): Promise<EnemyObject[]> {
        if (paginator) {
            return await this.repoEnemy.findAll({
                offset: paginator.page * paginator.per_page,
                limit: paginator.per_page,
            });
        }
        return await this.repoEnemy.findAll();
    }

    async deleteEnemy(enemy_id: number) {
        try {
            const result = await this.repoEnemy.destroy({
                where: { id: enemy_id },
                force: true,
            });
            return { rows: result };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }
}
