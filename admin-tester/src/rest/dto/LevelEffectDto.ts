import { PropertyColumns } from "src/modules/Postgres/entity/enums";

// 
export class LevelEffectDto {
    count_matches: number;
    is_equipment: boolean;
    property_column: PropertyColumns;
    delta_value: number;
}
