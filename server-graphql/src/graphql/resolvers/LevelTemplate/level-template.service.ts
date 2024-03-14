import { Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { PaginatorArgs } from 'nestjs-graphql-tools';
// 
import { LevelTemplate } from '../../../modules/Postgres/entity/LevelTemplate';
import { PlayerProperty } from '../../../modules/Postgres/entity/PlayerProperty';
import { InventoryProduct } from '../../../modules/Postgres/entity/InventoryProduct';
import { LevelTemplateSkill } from '../../../modules/Postgres/entity/LevelTemplateSkill';
import { Inventory } from '../../../modules/Postgres/entity/Inventory';
import { Sorting } from '../../../modules/Postgres/enums/Sorting';
import { ErrorHelper } from '../services/ErrorHelper';
import { ProductHelper } from '../services/ProductHelper';
import { PropertyHelper } from '../services/PropertyHelper';
import { SkillHelper } from '../services/SkillHelper';
import { LevelTemplateObject, NewLevelTemplateInput, UpdateLevelTemplateInput } from './level-template.objects';



// 
@Injectable()
export class LevelTemplateService {
    private repoTemplate: Repository<LevelTemplate>;
    private repoInventoryProduct: Repository<InventoryProduct>;
    private repoLevelTemplateSkill: Repository<LevelTemplateSkill>;

    constructor(
        private sequelize: Sequelize,
        private productHelper: ProductHelper,
        private propertiesHelper: PropertyHelper,
        private skillHelper: SkillHelper,
        private errorHelper: ErrorHelper,
    ) {
        this.repoTemplate = this.sequelize.getRepository(LevelTemplate);
        this.repoInventoryProduct = this.sequelize.getRepository(InventoryProduct);
        this.repoLevelTemplateSkill = this.sequelize.getRepository(LevelTemplateSkill);
    }

    // 
    async insertTemplate(idto: NewLevelTemplateInput) {

        const tmpProperties = new PlayerProperty();
        this.propertiesHelper.deltaProperties(tmpProperties, idto.properties);

        const tmpProducts: InventoryProduct[] = [];
        await this.productHelper.addProductsToList(tmpProducts, idto.products);

        const tmpSkills: LevelTemplateSkill[] = [];
        await this.skillHelper.addLevelSkills(tmpSkills, idto.skills);

        // 
        const inventory = new Inventory();
        inventory.sorting = Sorting.none;

        const levelTemplate = new LevelTemplate();
        levelTemplate.title = idto.title;

        // 
        const t = await this.sequelize.transaction();
        try {

            await tmpProperties.save({ transaction: t });
            levelTemplate.properties_id = tmpProperties.id;

            await inventory.save({ transaction: t });
            levelTemplate.inventory_id = inventory.id;

            if (tmpProducts.length > 0) {
                for (const p of tmpProducts) {
                    p.inventory_id = inventory.id;
                    await p.save({ transaction: t });
                }
            }

            await levelTemplate.save({ transaction: t });

            if (tmpSkills.length > 0) {
                for (const s of tmpSkills) {
                    s.level_template_id = levelTemplate.id;
                    await s.save({ transaction: t });
                }
            }

            await t.commit();
            return levelTemplate;
        }
        catch (err) {
            await t.rollback();
            this.errorHelper.transactionError(err.message);
        }
    }

    async updateTemplate(udto: UpdateLevelTemplateInput) {

        const levelTemplate = await this.repoTemplate.findOne({
            where: {
                id: udto.template_id,
            },
            include: [
                { association: 'playerProperty' },
                { association: 'inventory', include: ['linkInventoryProduct'] },
                { association: 'linkLevelTemplateSkill' },
            ],
        });
        this.errorHelper.foundError(levelTemplate, 'template_id');

        // 
        const tmpProperties = levelTemplate.playerProperty;
        this.propertiesHelper.deltaProperties(tmpProperties, udto.delta_properties);

        const tmpProducts = levelTemplate.inventory.linkInventoryProduct;
        await this.productHelper.refillProducts(tmpProducts, udto.products);

        const tmpSkills = levelTemplate.linkLevelTemplateSkill;
        const removeSkills = this.skillHelper.filterSkills(tmpSkills, udto.skills);
        await this.skillHelper.refillLevelSkills(tmpSkills, udto.skills);

        // 
        const addProducts = tmpProducts.filter(p => p.count_in_all_slots > 0);
        const removeProducts = tmpProducts.filter(p => (
            (p.id >= 0) && p.count_in_all_slots <= 0
        ));
        const addSkills = tmpSkills;

        if (udto.title) levelTemplate.title = udto.title;

        // 
        const t = await this.sequelize.transaction();
        try {

            await this.repoInventoryProduct.destroy(
                { where: { id: removeProducts.map(p => p.id) }, transaction: t }
            );

            if (addProducts.length > 0) {
                for (const p of addProducts) {
                    p.inventory_id = levelTemplate.inventory.id;
                    await p.save({ transaction: t });
                }
            }

            await this.repoLevelTemplateSkill.destroy(
                { where: { id: removeSkills.map(s => s.id) }, transaction: t }
            );

            if (addSkills.length > 0) {
                for (const s of addSkills) {
                    s.level_template_id = levelTemplate.id
                    await s.save({ transaction: t });
                }
            }

            await levelTemplate.playerProperty.save();
            await levelTemplate.save({ transaction: t });

            await t.commit();
        }
        catch (err) {
            await t.rollback();
            this.errorHelper.transactionError(err.message);
        }
        return levelTemplate;
    }

    async getOneTemplate(template_id: number): Promise<LevelTemplateObject> {
        return await this.repoTemplate.findOne({ where: { id: template_id } });
    }

    async getAllTemplates(paginator: PaginatorArgs): Promise<LevelTemplateObject[]> {
        if (paginator) {
            return await this.repoTemplate.findAll({
                offset: paginator.page * paginator.per_page,
                limit: paginator.per_page,
            });
        }
        return await this.repoTemplate.findAll();
    }

    async deleteTemplate(template_id: number) {
        try {
            const result = await this.repoTemplate.destroy({
                where: { id: template_id },
                force: true,
            });
            return { rows: result };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }
}
