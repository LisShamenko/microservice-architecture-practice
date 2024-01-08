import { InjectDataSource } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { assign, omit } from "lodash";
// 
import { InventoryProduct } from "src/modules/Postgres/entity/InventoryProduct";
import { LevelTemplate } from "src/modules/Postgres/entity/LevelTemplate";
import { PlayerProperty } from "src/modules/Postgres/entity/PlayerProperty";
import { PlayerSkill } from "src/modules/Postgres/entity/PlayerSkill";
import { EnemySkill } from "src/modules/Postgres/entity/EnemySkill";
import { ErrorHelper } from "./ErrorHelper";


// 
interface ISkillId {
    skill_id: number;
}

@Injectable()
export class TemplateHelper {
    constructor(
        @InjectDataSource('postgres_db') private dataSource: DataSource,
        private errorHelper: ErrorHelper,
    ) { }

    async getEnemyTemplate(level_template_id: number) {
        return await this.getTemplate<EnemySkill>(level_template_id, EnemySkill);
    }

    async getPalyerTemplate(level_template_id: number) {
        return await this.getTemplate<PlayerSkill>(level_template_id, PlayerSkill);
    }

    async getTemplate<T extends ISkillId>(
        level_template_id: number, creator: new () => T
    ) {

        const template = await this.dataSource.getRepository(LevelTemplate)
            .findOne({
                where: {
                    id: level_template_id,
                },
                relations: {
                    playerProperty: true,
                    inventory: {
                        products: true
                    },
                    skills: true,
                },
            });
        this.errorHelper.foundError(template, 'template_id');

        const properties: PlayerProperty = assign(
            new PlayerProperty(),
            omit(template.playerProperty, ['id'])
        );

        const products: InventoryProduct[] = [];
        template.inventory.products.forEach(p => {
            products.push(assign(new InventoryProduct(), omit(p, ['id'])));
        });

        const skills: T[] = [];
        template.skills.forEach(s => {
            const skill = new creator();
            skill.skill_id = s.skill_id;
            skills.push(skill);
        });

        // 
        return { properties, products, skills };
    }
}
