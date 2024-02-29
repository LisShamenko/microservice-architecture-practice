import { InsertPropertiesDto } from "../../../rest/dto/InsertPropertiesDto";
import { ProductItemDto } from "../../../rest/dto/ProductItemDto";

// 
export class InsertTemplateDto {
    title: string;
    coins: number;
    properties: InsertPropertiesDto;
    products?: ProductItemDto[];
    skills?: string[];
}
