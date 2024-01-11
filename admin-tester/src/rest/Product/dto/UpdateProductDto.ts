import { ProductTypes } from "../../../modules/Postgres/enums/ProductTypes";
import { FillSkillsDto } from "../../../rest/dto/FillSkillsDto";
import { RequirementDto } from "../../../rest/dto/RequirementDto";

// 
export class UpdateProductDto {
    title: string;
    price: number;
    max_in_slot: number;
    requirement: RequirementDto;
    skills: FillSkillsDto;
    type: ProductTypes;
}
