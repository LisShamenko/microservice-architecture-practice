import { InsertPropertiesDto } from "../../../rest/dto/InsertPropertiesDto";
import { FillProductsDto } from "../../../rest/dto/FillProductsDto";
import { FillSkillsDto } from "../../../rest/dto/FillSkillsDto";
import { LevelEffectDto } from "../../../rest/dto/LevelEffectDto";

// 
export class InsertPlayerDto {
    login: string;
    password: string;
    firstname: string;
    secondname: string;
    thirdname: string;
    email: string;
    level_template_id: string;
    delta_properties: InsertPropertiesDto;
    products?: FillProductsDto;
    skills?: FillSkillsDto;
    effects?: LevelEffectDto[];
}
