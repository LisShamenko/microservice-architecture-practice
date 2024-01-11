import { EnemyTypes } from "../../../modules/Postgres/enums/EnemyTypes";
import { InsertPropertiesDto } from "../../../rest/dto/InsertPropertiesDto";
import { FillProductsDto } from "../../dto/FillProductsDto";
import { FillSkillsDto } from "../../../rest/dto/FillSkillsDto";

// 
export class UpdateEnemyDto {
    nickname?: string;
    reset_template_id?: number;
    enemy_type?: EnemyTypes;
    delta_properties?: InsertPropertiesDto;
    products?: FillProductsDto;
    skills?: FillSkillsDto;
}
