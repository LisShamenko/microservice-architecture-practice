import { FillProductsDto } from "src/rest/dto/FillProductsDto";
import { FillSkillsDto } from "src/rest/dto/FillSkillsDto";
import { InsertPropertiesDto } from "src/rest/dto/InsertPropertiesDto";

// 
export class UpdateTemplateDto {
    title: string;
    delta_properties: InsertPropertiesDto;
    products?: FillProductsDto;
    skills?: FillSkillsDto;
}
