import { InsertPropertiesDto } from "../../../rest/dto/InsertPropertiesDto";
import { ProductItemDto } from "../../../rest/dto/ProductItemDto";

// 
export class InsertTemplateDto {
    title: string;
    properties: InsertPropertiesDto;
    products?: ProductItemDto[];
    skills?: number[];
}
