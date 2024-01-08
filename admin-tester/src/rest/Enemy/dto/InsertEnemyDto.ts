import { EnemyTypes } from "src/modules/Postgres/entity/enums";
import { InsertPropertiesDto } from "src/rest/dto/InsertPropertiesDto";
import { FillProductsDto } from "../../dto/FillProductsDto";
import { FillSkillsDto } from "src/rest/dto/FillSkillsDto";

// 
export class InsertEnemyDto {
    nickname: string;
    level_template_id: number;
    enemy_type: EnemyTypes;
    delta_properties: InsertPropertiesDto;
    products?: FillProductsDto;
    skills?: FillSkillsDto;
}
