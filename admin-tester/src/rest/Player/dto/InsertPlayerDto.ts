import { InsertPropertiesDto } from "src/rest/dto/InsertPropertiesDto";
import { FillProductsDto } from "src/rest/dto/FillProductsDto";
import { FillSkillsDto } from "src/rest/dto/FillSkillsDto";
import { LevelEffectDto } from "src/rest/dto/LevelEffectDto";

// 
export class InsertPlayerDto {
    login: string;
    password: string;
    firstname: string;
    secondname: string;
    thirdname: string;
    email: string;
    level_template_id: number;
    delta_properties: InsertPropertiesDto;
    products?: FillProductsDto;
    skills?: FillSkillsDto;
    effects?: LevelEffectDto[];
}
