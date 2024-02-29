import { Vector3Dto } from "../../../rest/dto/Vector3Dto";

// 
export class InsertMapDto {
    scene_id: string;
    title: string;
    all_poins: Vector3Dto[];
}
