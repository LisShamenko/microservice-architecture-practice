import { InsertPropertiesDto } from "src/rest/dto/InsertPropertiesDto";
import { FillProductsDto } from "src/rest/dto/FillProductsDto";
import { FillSkillsDto } from "src/rest/dto/FillSkillsDto";
import { LevelEffectDto } from "src/rest/dto/LevelEffectDto";

// 
export class UpdatePlayerDto {
    firstname?: string;
    secondname?: string;
    thirdname?: string;
    email?: string;
    delta_properties?: InsertPropertiesDto;
    products?: FillProductsDto;
    skills?: FillSkillsDto;
    effects?: {
        add: LevelEffectDto[],
        remove: number[],
    }
}
