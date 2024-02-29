import { FillSkillsDto } from "../../../rest/dto/FillSkillsDto";
import { RequirementDto } from "../../../rest/dto/RequirementDto";
import { ProductTypeOptions } from "../../../rest/dto/ProductTypeOptions";



// 
export class UpdateProductDto {
    title: string;
    price: number;
    max_in_slot: number;
    requirement: RequirementDto;
    skills: FillSkillsDto;
    type_options: ProductTypeOptions;
}
