import { InsertPropertiesDto } from "../../../rest/dto/InsertPropertiesDto";
import { FillProductsDto } from "../../../rest/dto/FillProductsDto";
import { FillSkillsDto } from "../../../rest/dto/FillSkillsDto";
import { LevelEffectDto } from "../../../rest/dto/LevelEffectDto";

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
