import { RequirementDto } from "../../../rest/dto/RequirementDto";

// 
export class UpdateSkillDto {
    title: string;
    parent_skill_id: string;
    requirement: RequirementDto;
}
