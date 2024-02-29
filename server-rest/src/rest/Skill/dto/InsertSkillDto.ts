import { RequirementDto } from "../../../rest/dto/RequirementDto";

// 
export class InsertSkillDto {
    title: string;
    parent_skill_id: string | null;
    requirement: RequirementDto;
}
