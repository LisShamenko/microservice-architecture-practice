import { Injectable } from "@nestjs/common";
import { Repository, Sequelize } from "sequelize-typescript";
// 
import { InventoryProduct } from "../../../modules/Postgres/entity/InventoryProduct";
import { LevelTemplate } from "../../../modules/Postgres/entity/LevelTemplate";
import { PlayerProperty } from "../../../modules/Postgres/entity/PlayerProperty";
import { PlayerSkill } from "../../../modules/Postgres/entity/PlayerSkill";
import { EnemySkill } from "../../../modules/Postgres/entity/EnemySkill";
import { ErrorHelper } from "./ErrorHelper";
import { PropertyHelper } from "./PropertyHelper";



// 
interface ISkillId {
    skill_id: number;
}

@Injectable()
export class TemplateHelper {
    private repoLevelTemplate: Repository<LevelTemplate>;

    constructor(
        private sequelize: Sequelize,
        private propertyHelper: PropertyHelper,
        private errorHelper: ErrorHelper,
    ) {
        this.repoLevelTemplate = this.sequelize.getRepository(LevelTemplate);
    }

    async getEnemyTemplate(level_template_id: number) {
        return await this.getTemplate<EnemySkill>(level_template_id, EnemySkill);
    }

    async getPalyerTemplate(level_template_id: number) {
        return await this.getTemplate<PlayerSkill>(level_template_id, PlayerSkill);
    }

    async getTemplate<T extends ISkillId>(
        level_template_id: number, creator: new () => T
    ) {

        const template = await this.repoLevelTemplate.findOne({
            where: {
                id: level_template_id,
            },
            include: [
                { association: 'playerProperty' },
                { association: 'inventory', include: ['linkInventoryProduct'] },
                { association: 'skills' },
                { association: 'linkLevelTemplateSkill' },
            ],
        });
        this.errorHelper.foundError(template, 'template_id');

        const tmpProperties: PlayerProperty = this.propertyHelper
            .newProperties(template.playerProperty);

        const tmpProducts: InventoryProduct[] = [];
        template.inventory.linkInventoryProduct.forEach(p => {
            const inventoryProduct = new InventoryProduct();
            inventoryProduct.product_id = p.product_id;
            inventoryProduct.count_in_all_slots = p.count_in_all_slots;
            tmpProducts.push(inventoryProduct);
        });

        const tmpSkills: T[] = [];
        template.linkLevelTemplateSkill.forEach(s => {
            const skill = new creator();
            skill.skill_id = s.skill_id;
            tmpSkills.push(skill);
        });

        return { tmpProperties, tmpProducts, tmpSkills };
    }
}
