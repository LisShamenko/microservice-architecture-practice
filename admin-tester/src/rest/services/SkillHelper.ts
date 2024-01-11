import { InjectDataSource } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { DataSource, In } from "typeorm";
// 
import { FillSkillsDto } from "../dto/FillSkillsDto";
import { EnemySkill } from "../../modules/Postgres/entity/EnemySkill";
import { Skill } from "../../modules/Postgres/entity/Skill";
import { LevelTemplateSkill } from "../../modules/Postgres/entity/LevelTemplateSkill";
import { PlayerSkill } from "../../modules/Postgres/entity/PlayerSkill";
import { ProductSkill } from "../../modules/Postgres/entity/ProductSkill";

// 
interface ISkillId {
    skill_id: number;
}

@Injectable()
export class SkillHelper {
    constructor(
        @InjectDataSource('postgres_db') private dataSource: DataSource,
    ) { }

    // 
    async refillEnemySkills(tmpSkills: EnemySkill[], skills: FillSkillsDto) {
        if (skills) {
            await this.addSkills<EnemySkill>(tmpSkills, skills.add,
                EnemySkill);
            this.removeSkills<EnemySkill>(tmpSkills, skills.remove);
        }
    }

    async refillPlayerSkills(tmpSkills: PlayerSkill[], skills: FillSkillsDto) {
        if (skills) {
            await this.addSkills<PlayerSkill>(tmpSkills, skills.add,
                PlayerSkill);
            this.removeSkills<PlayerSkill>(tmpSkills, skills.remove);
        }
    }

    async refillLevelSkills(tmpSkills: LevelTemplateSkill[], skills: FillSkillsDto) {
        if (skills) {
            await this.addSkills<LevelTemplateSkill>(tmpSkills, skills.add,
                LevelTemplateSkill);
            this.removeSkills<LevelTemplateSkill>(tmpSkills, skills.remove);
        }
    }

    async refillProductSkills(tmpSkills: ProductSkill[], skills: FillSkillsDto) {
        if (skills) {
            await this.addSkills<ProductSkill>(tmpSkills, skills.add,
                ProductSkill);
            this.removeSkills<ProductSkill>(tmpSkills, skills.remove);
        }
    }

    // 
    async addLevelSkills(tmpSkills: LevelTemplateSkill[], idtoSkills: number[]) {
        await this.addSkills<LevelTemplateSkill>(tmpSkills, idtoSkills,
            LevelTemplateSkill);
    }

    async addProductSkills(tmpSkills: ProductSkill[], idtoSkills: number[]) {
        await this.addSkills<ProductSkill>(tmpSkills, idtoSkills,
            ProductSkill);
    }

    // 
    async addSkills<T extends ISkillId>(
        tmpSkills: T[], idtoSkills: number[], creator: new () => T
    ) {
        if (!idtoSkills || idtoSkills.length <= 0) return;

        const skills = await this.dataSource.getRepository(Skill)
            .find({
                select: { id: true },
                where: { id: In(idtoSkills) }
            });

        idtoSkills.forEach(idto_s => {
            if (skills.findIndex(s => s.id === idto_s) >= 0 &&
                tmpSkills.findIndex(es => es.skill_id === idto_s) < 0
            ) {
                const enemySkill = new creator();
                enemySkill.skill_id = idto_s;
                tmpSkills.push(enemySkill);
            }
        });
    }

    removeSkills<T extends ISkillId>(
        tmpSkills: T[], idtoSkills: number[]
    ) {
        if (!idtoSkills || idtoSkills.length <= 0) return;

        idtoSkills.forEach(idto_s => {
            const ind = tmpSkills.findIndex(s => s.skill_id === idto_s);
            if (ind >= 0) {
                tmpSkills.splice(ind, ind + 1);
            }
        });
    }

    // 
    filterSkills<T extends ISkillId>(tmpSkills: T[], udtoSkills: FillSkillsDto) {
        if (udtoSkills && udtoSkills.remove && udtoSkills.remove.length > 0) {
            return tmpSkills.filter(s => udtoSkills.remove.includes(s.skill_id));
        }
        return [];
    }
}
