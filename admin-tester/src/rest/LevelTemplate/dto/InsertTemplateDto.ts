import { InsertPropertiesDto } from "src/rest/dto/InsertPropertiesDto";
import { ProductItemDto } from "src/rest/dto/ProductItemDto";

// 
export class InsertTemplateDto {
    title: string;
    properties: InsertPropertiesDto;
    products?: ProductItemDto[];
    skills?: number[];
}
