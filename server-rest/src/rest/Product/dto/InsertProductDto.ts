import { RequirementDto } from "../../../rest/dto/RequirementDto";
import { ProductTypeOptions } from "../../../rest/dto/ProductTypeOptions";



// 
export class InsertProductDto {
    title: string;
    price: number;
    max_in_slot: number;
    requirement: RequirementDto;
    skills: string[];
    type_options: ProductTypeOptions;
}
