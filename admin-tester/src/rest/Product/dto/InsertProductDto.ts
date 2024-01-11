import { ProductTypes } from "../../../modules/Postgres/enums/ProductTypes";
import { RequirementDto } from "../../../rest/dto/RequirementDto";

// 
export class InsertProductDto {
    title: string;
    price: number;
    max_in_slot: number;
    requirement: RequirementDto;
    skills: number[];
    type: ProductTypes;
}
