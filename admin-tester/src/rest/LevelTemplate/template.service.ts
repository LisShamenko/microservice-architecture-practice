import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { DataSource } from 'typeorm';
//
import { InsertTemplateDto } from './dto/InsertTemplateDto';
import { UpdateTemplateDto } from './dto/UpdateTemplateDto';
import { LevelTemplate } from '../../modules/Postgres/entity/LevelTemplate';
import { PlayerProperty } from '../../modules/Postgres/entity/PlayerProperty';
import { Inventory } from '../../modules/Postgres/entity/Inventory';
import { InventoryProduct } from '../../modules/Postgres/entity/InventoryProduct';
import { LevelTemplateSkill } from '../../modules/Postgres/entity/LevelTemplateSkill';
import { ProductHelper } from '../services/ProductHelper';
import { PropertyHelper } from '../services/PropertyHelper';
import { SkillHelper } from '../services/SkillHelper';
import { ErrorHelper } from '../services/ErrorHelper';

//
@Injectable()
export class TemplateService {
    constructor(
        @InjectDataSource('postgres_db') private dataSource: DataSource,
        private productHelper: ProductHelper,
        private propertiesHelper: PropertyHelper,
        private skillHelper: SkillHelper,
        private errorHelper: ErrorHelper,
    ) { }

    // 
    async insertTemplate(idto: InsertTemplateDto) {

        const properties = new PlayerProperty();
        this.propertiesHelper.setProperties(properties, idto.properties);

        const tmpProducts: InventoryProduct[] = [];
        await this.productHelper.addProductsToList(tmpProducts, idto.products);

        const tmpSkills: LevelTemplateSkill[] = [];
        await this.skillHelper.addLevelSkills(tmpSkills, idto.skills);

        // 
        const inventory = new Inventory();
        //      inventory.products = tmpProducts;

        const levelTemplate = new LevelTemplate();
        levelTemplate.title = idto.title;
        levelTemplate.playerProperty = properties;
        levelTemplate.inventory = inventory;
        levelTemplate.skills = tmpSkills;

        // 
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(properties);

            await queryRunner.manager.save(inventory);

            if (tmpProducts.length > 0) {
                tmpProducts.forEach(p => {
                    p.id = null;
                    p.inventory_id = inventory.id;
                });
                await queryRunner.manager.save(tmpProducts);
            }

            await queryRunner.manager.save(levelTemplate);

            if (tmpSkills.length > 0) {
                tmpSkills.forEach(s => { s.level_template_id = levelTemplate.id });
                await queryRunner.manager.save(tmpSkills);
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
        return { id: levelTemplate.id };
    }

    // 
    async updateTemplate(template_id: number, udto: UpdateTemplateDto) {

        const levelTemplate = await this.dataSource.getRepository(LevelTemplate)
            .findOne({
                where: {
                    id: template_id,
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
        this.errorHelper.foundError(levelTemplate, 'template_id');

        // 
        const properties = levelTemplate.playerProperty;
        this.propertiesHelper.setProperties(properties, udto.delta_properties);

        const tmpProducts = levelTemplate.inventory.products;
        await this.productHelper.refillProducts(tmpProducts, udto.products);

        const tmpSkills = levelTemplate.skills;
        const removeSkills = this.skillHelper.filterSkills(tmpSkills, udto.skills);
        await this.skillHelper.refillLevelSkills(tmpSkills, udto.skills);

        // 
        const addProducts = tmpProducts.filter(p => p.count_in_all_slots > 0);
        const removeProducts = tmpProducts.filter(p => (
            (p.id >= 0) && p.count_in_all_slots <= 0
        ));
        const addSkills = tmpSkills;

        // 
        if (udto.title) levelTemplate.title = udto.title;
        //      levelTemplate.inventory.products = addProducts;
        //      levelTemplate.skills = addSkills;

        // 
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            await queryRunner.manager.save(properties);

            if (removeProducts.length > 0) {
                await queryRunner.manager.remove(removeProducts);
            }

            if (addProducts.length > 0) {
                addProducts.forEach(p => {
                    p.inventory_id = levelTemplate.inventory.id;
                });
                await queryRunner.manager.save(addProducts);
            }

            if (removeSkills.length > 0) {
                await queryRunner.manager.remove(removeSkills);
            }

            if (addSkills.length > 0) {
                addSkills.forEach(s => { s.level_template_id = levelTemplate.id });
                await queryRunner.manager.save(addSkills);
            }

            await queryRunner.manager.save(levelTemplate);

            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.errorHelper.transactionError(err.message);
        }
        finally {
            await queryRunner.release();
        }
        return { id: levelTemplate.id };
    }

    // 
    async deleteTemplate(template_id: number) {
        try {
            const result = await this.dataSource.getRepository(LevelTemplate)
                .delete({ id: template_id });
            return { rows: result.affected };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }

    // 
    async getOneTemplate(template_id: number) {
        const template = await this.dataSource.getRepository(LevelTemplate)
            .findOne({
                where: {
                    id: template_id,
                },
                relations: {
                    playerProperty: true,
                    inventory: {
                        products: {
                            product: true,
                        },
                    },
                    skills: true,
                },
            });
        this.errorHelper.foundError(template, 'template_id');

        return {
            id: template.id,
            title: template.title,
            coins: template.coins,
            properties: omit(template.playerProperty, 'id'),
            inventory: {
                sorting: template.inventory.sorting,
                products: template.inventory.products.map(item => ({
                    count_in_slot: item.count_in_all_slots,
                    title: item.product.title,
                    price: item.product.price,
                    max_in_slot: item.product.max_in_slot,
                    requirement_id: item.product.requirement_id,
                })),
            },
            skills: template.skills.map(s => s.skill_id),
        };
    }

    // 
    async getAllTemplates() {
        const templates = await this.dataSource.getRepository(LevelTemplate)
            .find();

        return {
            templates: (!templates) ? [] : templates.map(template => ({
                id: template.id,
                title: template.title,
            }))
        }
    }
}
