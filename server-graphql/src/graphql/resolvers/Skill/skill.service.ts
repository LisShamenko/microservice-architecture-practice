import { Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { PaginatorArgs } from 'nestjs-graphql-tools';
// 
import { Skill } from '../../../modules/Postgres/entity/Skill';
import { PropertyHelper } from '../services/PropertyHelper';
import { ErrorHelper } from '../services/ErrorHelper';
import { NewSkillInput, SkillObject, UpdateSkillInput } from './skill.objects';



// 
@Injectable()
export class SkillService {
    private repoSkill: Repository<Skill>;

    constructor(
        private sequelize: Sequelize,
        private propertyHelper: PropertyHelper,
        private errorHelper: ErrorHelper,
    ) {
        this.repoSkill = this.sequelize.getRepository(Skill);
    }

    // 
    async insertSkill(idto: NewSkillInput) {

        if (idto.parent_skill_id) {
            const parentSkill = await this.repoSkill.findOne({
                where: { id: idto.parent_skill_id }
            });
            this.errorHelper.foundError(parentSkill, 'parent_skill_id');
        }

        //
        const requirement = this.propertyHelper
            .newRequirements(idto.requirement);

        const skill = new Skill();
        skill.title = idto.title;
        skill.parent_skill_id = idto.parent_skill_id;

        // 
        const t = await this.sequelize.transaction();
        try {
            await requirement.save({ transaction: t });
            skill.requirement_id = requirement.id;
            await skill.save({ transaction: t });
            await t.commit();
            return skill;
        }
        catch (err) {
            await t.rollback();
            this.errorHelper.transactionError(err.message);
        }
    }

    async updateSkill(udto: UpdateSkillInput) {

        const skill = await this.repoSkill.findOne({
            where: { id: udto.skill_id },
            include: ['requirement'],
        });
        this.errorHelper.foundError(skill, 'skill_id');

        if (udto.parent_skill_id) {
            const parentSkill = await this.repoSkill.findOne({
                where: { id: udto.parent_skill_id }
            });
            this.errorHelper.foundError(parentSkill, 'parent_skill_id');
            skill.parent_skill_id = udto.parent_skill_id;
        }

        // 
        if (udto.title) skill.title = udto.title;
        this.propertyHelper.setRequirements(
            skill.requirement, udto.requirement
        );

        // 
        const t = await this.sequelize.transaction();
        try {
            await skill.requirement.save({ transaction: t });
            await skill.save({ transaction: t });
            await t.commit();
        }
        catch (err) {
            await t.rollback();
            this.errorHelper.transactionError(err.message);
        }
        return skill;
    }

    async getOneSkill(skill_id: number): Promise<SkillObject> {
        return await this.repoSkill.findOne({ where: { id: skill_id } });
    }

    async getAllSkills(paginator: PaginatorArgs): Promise<SkillObject[]> {
        if (paginator) {
            return await this.repoSkill.findAll({
                offset: paginator.page * paginator.per_page,
                limit: paginator.per_page,
            });
        }
        return await this.repoSkill.findAll();
    }

    async deleteSkill(skill_id: number) {
        try {
            const result = await this.repoSkill.destroy({
                where: { id: skill_id },
                force: true,
            });
            return { rows: result };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }
}
