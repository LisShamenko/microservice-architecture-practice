import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// 
import { FillSkillsDto } from "../dto/FillSkillsDto";
import { Skill, SkillDocument } from "../../modules/Mongo/entity/Skill";



// 
@Injectable()
export class SkillHelper {
    constructor(
        @InjectModel(Skill.name, 'db') private skillModel: Model<SkillDocument>,
    ) { }

    // 
    async refillSkills(tmpSkills: string[], skills: FillSkillsDto) {
        if (skills) {
            await this.addSkills(tmpSkills, skills.add);
            this.removeSkills(tmpSkills, skills.remove);
        }
    }

    async addSkills(tmpSkills: string[], idtoSkills: string[]) {
        if (!idtoSkills || idtoSkills.length <= 0) return;

        const skills = await this.skillModel
            .find({ _id: { $in: idtoSkills } });

        idtoSkills.forEach(idto_s => {
            if (skills.findIndex(s => s.id === idto_s) < 0) return;
            if (tmpSkills.includes(idto_s)) return;
            tmpSkills.push(idto_s);
        });
    }

    removeSkills(tmpSkills: string[], idtoSkills: string[]) {
        if (!idtoSkills || idtoSkills.length <= 0) return;

        idtoSkills.forEach(idto_s => {
            const ind = tmpSkills.indexOf(idto_s);
            if (ind < 0) return;
            tmpSkills.splice(ind, 1);
        });
    }
}
