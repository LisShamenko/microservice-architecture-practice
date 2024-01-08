import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { assign, omit } from 'lodash';
import { DataSource } from 'typeorm';
//
import { InsertSkillDto } from './dto/InsertSkillDto';
import { UpdateSkillDto } from './dto/UpdateSkillDto';
import { Skill } from 'src/modules/Postgres/entity/Skill';
import { Requirement } from 'src/modules/Postgres/entity/Requirement';
import { ErrorHelper } from '../services/ErrorHelper';

//
@Injectable()
export class SkillService {
    constructor(
        @InjectDataSource('postgres_db') private dataSource: DataSource,
        private errorHelper: ErrorHelper,
    ) { }

    // 
    async insertSkill(idto: InsertSkillDto) {

        const parentSkill = await this.dataSource.getRepository(Skill)
            .findOne({ where: { id: idto.parent_skill_id } });
        this.errorHelper.foundError(parentSkill, 'parent_skill_id');

        // 
        const skill = new Skill();
        skill.title = idto.title;
        skill.parent_skill_id = idto.parent_skill_id;

        const requirement = assign(new Requirement(), idto.requirement);
        skill.requirement = requirement;

        //
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(requirement);
            await queryRunner.manager.save(skill);
            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.errorHelper.transactionError(err.message);
        }
        finally {
            await queryRunner.release();
        }
        return { id: skill.id };
    }

    // 
    async updateSkill(skill_id: number, udto: UpdateSkillDto) {

        const skill = await this.dataSource.getRepository(Skill)
            .findOne({
                where: { id: skill_id },
                relations: { requirement: true },
            });
        this.errorHelper.foundError(skill, 'skill_id');

        if (udto.parent_skill_id) {
            const parentSkill = await this.dataSource.getRepository(Skill)
                .findOne({ where: { id: udto.parent_skill_id } });
            this.errorHelper.foundError(parentSkill, 'parent_skill_id');
            skill.parent_skill_id = udto.parent_skill_id;
        }

        // 
        if (udto.title) skill.title = udto.title;
        assign(skill.requirement, udto.requirement);

        // 
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(skill.requirement);
            await queryRunner.manager.save(skill);
            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.errorHelper.transactionError(err.message);
        }
        finally {
            await queryRunner.release();
        }
        return { id: skill.id };
    }

    // 
    async deleteSkill(skill_id: number) {
        try {
            const result = await this.dataSource.getRepository(Skill)
                .delete({ id: skill_id });
            return { rows: result.affected };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }

    // 
    async getOneSkill(skill_id: number) {
        const skill = await this.dataSource.getRepository(Skill)
            .findOne({
                where: { id: skill_id },
                relations: { requirement: true },
            });
        this.errorHelper.foundError(skill, 'skill_id');

        return {
            id: skill.id,
            title: skill.title,
            parent_id: skill.parent_skill_id,
            requirement: omit(skill.requirement, 'id'),
        };
    }

    // 
    async getAllSkills() {
        const skills = await this.dataSource.getRepository(Skill).find();
        return {
            skills: (!skills) ? [] : skills.map(skill => ({
                id: skill.id,
                title: skill.title,
                parent_id: skill.parent_skill_id,
            }))
        }
    }
}
