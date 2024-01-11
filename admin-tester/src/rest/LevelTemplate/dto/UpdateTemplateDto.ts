import { FillProductsDto } from "../../../rest/dto/FillProductsDto";
import { FillSkillsDto } from "../../../rest/dto/FillSkillsDto";
import { InsertPropertiesDto } from "../../../rest/dto/InsertPropertiesDto";

// 
export class UpdateTemplateDto {
    title: string;
    delta_properties: InsertPropertiesDto;
    products?: FillProductsDto;
    skills?: FillSkillsDto;
}
