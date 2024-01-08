import { Vector3Dto } from "src/rest/dto/Vector3Dto";

// 
export class InsertMapDto {
    scene_id: number;
    title: string;
    all_poins: Vector3Dto[];
}
