import { PropertyColumns } from "../../modules/Postgres/enums/PropertyColumns";

// 
export class LevelEffectDto {
    count_matches: number;
    is_equipment: boolean;
    property_column: PropertyColumns;
    delta_value: number;
}
