import { RequirementDto } from "src/rest/dto/RequirementDto";

// 
export class UpdateSkillDto {
    title: string;
    parent_skill_id: number;
    requirement: RequirementDto;
}
