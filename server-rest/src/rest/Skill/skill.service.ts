import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//
import { InsertSkillDto } from './dto/InsertSkillDto';
import { UpdateSkillDto } from './dto/UpdateSkillDto';
import { ErrorHelper } from '../services/ErrorHelper';
import { Skill, SkillDocument } from '../../modules/Mongo/Entity/Skill';
import { Requirement } from '../../modules/Mongo/Entity/Requirement';
import { PropertyHelper } from '../services/PropertyHelper';
import { RedisRepository } from 'src/modules/RedisClient/redis.repository';
import { Prefix } from '../enums/prefix.enum';



//
@Injectable()
export class SkillService {
    constructor(
        @InjectModel(Skill.name, 'db')
        private skillModel: Model<SkillDocument>,
        private errorHelper: ErrorHelper,
        private propertyHelper: PropertyHelper,
        @Inject(RedisRepository)
        private repository: RedisRepository,
    ) { }

    // admin
    async insertSkill(idto: InsertSkillDto) {

        let parentSkillId = null;
        if (idto.parent_skill_id) {
            const parentSkill = await this.skillModel
                .where({ _id: idto.parent_skill_id })
                .findOne();
            this.errorHelper.foundError(parentSkill, 'parent_skill_id');

            parentSkillId = parentSkill._id;
        }

        const skill = new Skill();
        skill.title = idto.title;
        skill.parent_skill_id = parentSkillId;
        skill.requirements = this.propertyHelper
            .newRequirements(idto.requirement);

        const newSkill = new this.skillModel(skill);
        const result = await newSkill.save();
        return { id: result.id };
    }

    // admin
    async updateSkill(skill_id: string, udto: UpdateSkillDto) {

        const skill = await this.skillModel
            .where({ _id: skill_id })
            .findOne();
        this.errorHelper.foundError(skill, 'skill_id');

        if (udto.parent_skill_id) {
            const parentSkill = await this.skillModel
                .where({ _id: udto.parent_skill_id })
                .findOne();
            this.errorHelper.foundError(parentSkill, 'parent_skill_id');

            skill.parent_skill_id = parentSkill._id;
        }

        if (udto.title) skill.title = udto.title;

        const requirements = new Requirement();
        this.propertyHelper.setRequirements(requirements, udto.requirement);
        skill.requirements = requirements;

        const result = await skill.save();
        return { id: result.id };
    }

    // admin
    async deleteSkill(skill_id: string) {
        try {
            const result = await this.skillModel
                .deleteOne({ _id: skill_id });
            return { rows: result.deletedCount };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }

    // user, admin
    async getOneSkill(skill_id: string) {

        let result = await this.repository.getObject(Prefix.skill, skill_id);
        if (!result) {

            const skill = await this.skillModel
                .where({ _id: skill_id })
                .populate('parent_skill')
                .findOne();
            this.errorHelper.foundError(skill, 'skill_id');

            result = {
                id: skill.id,
                title: skill.title,
                parent_id: skill.parent_skill_id,
                requirement: skill.requirements,
                parent: {
                    title: skill.parent_skill[0].title,
                }
            };
            await this.repository.saveObject(Prefix.skill, skill.id, result);
        }
        return result;
    }

    // user, admin
    async getAllSkills() {

        let result = await this.repository.getList(Prefix.skill);
        if (!result) {

            const skills = await this.skillModel
                .find();

            result = {
                skills: (!skills) ? [] : skills.map(skill => ({
                    id: skill.id,
                    title: skill.title,
                    parent_id: skill.parent_skill_id,
                }))
            }
            await this.repository.saveList(Prefix.skill, result);
        }
        return result;
    }
}
