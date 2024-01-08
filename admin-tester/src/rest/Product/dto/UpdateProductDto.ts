import { ProductTypes } from "src/modules/Postgres/entity/enums";
import { FillSkillsDto } from "src/rest/dto/FillSkillsDto";
import { RequirementDto } from "src/rest/dto/RequirementDto";

// 
export class UpdateProductDto {
    title: string;
    price: number;
    max_in_slot: number;
    requirement: RequirementDto;
    skills: FillSkillsDto;
    type: ProductTypes;
}
