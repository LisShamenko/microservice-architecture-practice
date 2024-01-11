import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { assign, omit } from 'lodash';
//
import { InsertEnemyDto } from './dto/InsertEnemyDto';
import { UpdateEnemyDto } from './dto/UpdateEnemyDto';
import { Enemy } from '../../modules/Postgres/entity/Enemy';
import { Inventory } from '../../modules/Postgres/entity/Inventory';
import { InventoryProduct } from '../../modules/Postgres/entity/InventoryProduct';
import { EnemySkill } from '../../modules/Postgres/entity/EnemySkill';
import { ProductHelper } from '../services/ProductHelper';
import { PropertyHelper } from '../services/PropertyHelper';
import { SkillHelper } from '../services/SkillHelper';
import { TemplateHelper } from '../services/TemplateHelper';
import { ErrorHelper } from '../services/ErrorHelper';

//
@Injectable()
export class EnemyService {
    constructor(
        @InjectDataSource('postgres_db') private dataSource: DataSource,
        private errorHelper: ErrorHelper,
        private templateHelper: TemplateHelper,
        private productHelper: ProductHelper,
        private propertyHelper: PropertyHelper,
        private skillHelper: SkillHelper,
    ) { }

    // 
    async insertEnemy(idto: InsertEnemyDto) {

        const tmp = await this.templateHelper.getEnemyTemplate(idto.level_template_id);
        this.errorHelper.foundError(tmp, 'level_template_id');

        this.propertyHelper.setProperties(tmp.properties, idto.delta_properties);
        await this.productHelper.refillProducts(tmp.products, idto.products);
        await this.skillHelper.refillEnemySkills(tmp.skills, idto.skills);

        // 
        const inventory: Inventory = new Inventory();
        inventory.products = [];

        const enemy: Enemy = new Enemy();
        enemy.enemy_type = idto.enemy_type;
        enemy.nickname = idto.nickname;
        enemy.inventory = inventory;
        enemy.playerProperty = tmp.properties;
        enemy.level_template_id = idto.level_template_id;
        enemy.skills = [];
        enemy.skills.push(...tmp.skills);

        //
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(tmp.properties);

            await queryRunner.manager.save(enemy.inventory);

            if (tmp.products.length > 0) {
                tmp.products.forEach(p => {
                    p.id = null;
                    p.inventory_id = enemy.inventory.id;
                });
                enemy.inventory.products.push(...tmp.products);
                await queryRunner.manager.save(tmp.products);
            }

            enemy.properties_id = tmp.properties.id;
            enemy.inventory_id = enemy.inventory.id;
            await queryRunner.manager.save(enemy);

            if (tmp.skills.length > 0) {
                tmp.skills.forEach(s => { s.enemy_id = enemy.id });
                await queryRunner.manager.save(enemy.skills);
            }

            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.errorHelper.transactionError(err.message);
        }
        finally {
            await queryRunner.release();
        }
        return { id: enemy.id };
    }

    // 
    async updateEnemy(enemy_id: number, udto: UpdateEnemyDto) {

        const enemy = await this.dataSource.getRepository(Enemy).findOne({
            where: {
                id: enemy_id,
            },
            relations: {
                playerProperty: true,
                inventory: {
                    products: {
                        product: true,
                    }
                },
                skills: true,
            },
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
            // refactor_10 - сброс уровня при смене шаблона персонажа
            enemy.level_template_id = udto.reset_template_id;

            const tmp = await this.templateHelper.getEnemyTemplate(
                udto.reset_template_id);

            this.propertyHelper.setProperties(tmp.properties, udto.delta_properties);
            assign(enemy.playerProperty, tmp.properties);

            await this.productHelper.refillProducts(tmp.products, udto.products);
            await this.skillHelper.refillEnemySkills(tmp.skills, udto.skills);

            // 
            addProducts = tmp.products.filter(p => p.count_in_all_slots > 0);
            removeProducts = enemy.inventory.products;
            addSkills = tmp.skills;
            removeSkills = enemy.skills;
        }
        else {

            this.propertyHelper.setProperties(enemy.playerProperty, udto.delta_properties);

            const tmpProducts = enemy.inventory.products;
            await this.productHelper.refillProducts(tmpProducts, udto.products);

            const tmpSkills = enemy.skills;
            removeSkills = this.skillHelper.filterSkills(tmpSkills, udto.skills);
            await this.skillHelper.refillEnemySkills(tmpSkills, udto.skills);

            //
            addProducts = tmpProducts.filter(p => p.count_in_all_slots > 0);
            removeProducts = tmpProducts.filter(p => (
                p.id && p.count_in_all_slots <= 0
            ));
            addSkills = tmpSkills;
        }

        // 
        if (udto.enemy_type) enemy.enemy_type = udto.enemy_type;
        if (udto.nickname) enemy.nickname = udto.nickname;
        enemy.inventory.products = addProducts;
        enemy.skills = addSkills;

        // 
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            await queryRunner.manager.save(enemy.playerProperty);

            if (removeProducts.length > 0) {
                await queryRunner.manager.remove(removeProducts);
            }

            if (addProducts.length > 0) {
                addProducts.forEach(p => {
                    p.inventory_id = enemy.inventory.id;
                });
                await queryRunner.manager.save(addProducts);
            }

            if (removeSkills.length > 0) {
                await queryRunner.manager.remove(removeSkills);
            }

            if (addSkills.length > 0) {
                addSkills.forEach(s => { s.enemy_id = enemy.id });
                await queryRunner.manager.save(enemy.skills);
            }

            await queryRunner.manager.save(enemy);

            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.errorHelper.transactionError(err.message);
        }
        finally {
            await queryRunner.release();
        }
        return { id: enemy.id };
    }

    // 
    async deleteEnemy(enemy_id: number) {
        try {
            const result = await this.dataSource.getRepository(Enemy)
                .delete({ id: enemy_id });
            return { rows: result.affected };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }

    // 
    async getOneEnemy(enemy_id: number) {
        const enemy = await this.dataSource.getRepository(Enemy).findOne({
            where: {
                id: enemy_id,
            },
            relations: {
                inventory: {
                    products: {
                        product: true,
                    },
                },
                playerProperty: true,
                levelTemplate: true,
                skills: true,
            },
        });
        this.errorHelper.foundError(enemy, 'enemy_id');

        return {
            id: enemy.id,
            nickname: enemy.nickname,
            enemy_type: enemy.enemy_type,
            inventory: {
                sorting: enemy.inventory.sorting,
                products: enemy.inventory.products.map(item => ({
                    count_in_slot: item.count_in_all_slots,
                    title: item.product.title,
                    price: item.product.price,
                    max_in_slot: item.product.max_in_slot,
                    requirement_id: item.product.requirement_id,
                })),
            },
            properties: omit(enemy.playerProperty, 'id'),
            template: {
                title: enemy.levelTemplate.title,
            },
            skills: enemy.skills.map(s => s.skill_id),
        };
    }

    // 
    async getAllEnemies() {
        const enemies = await this.dataSource.getRepository(Enemy).find();
        return {
            enemies: (!enemies) ? [] : enemies.map(enemy => ({
                id: enemy.id,
                nickname: enemy.nickname,
            }))
        }
    }
}
