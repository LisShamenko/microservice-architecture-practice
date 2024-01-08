import { ProductTypes } from "src/modules/Postgres/entity/enums";
import { RequirementDto } from "src/rest/dto/RequirementDto";

// 
export class InsertProductDto {
    title: string;
    price: number;
    max_in_slot: number;
    requirement: RequirementDto;
    skills: number[];
    type: ProductTypes;
}
