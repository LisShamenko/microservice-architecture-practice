import { ActivityPointTypes } from "src/modules/Postgres/entity/enums";
import { Vector3Dto } from "./Vector3Dto";

// 
export class PointItemDto {
    point_id: number;
    position: Vector3Dto;
    type: ActivityPointTypes;
    spawn?: {
        is_player: boolean,
        is_enemy: boolean,
    }
    teleport?: {
        next_activity_id: number,
        prev_activity_id: number,
    }
}
