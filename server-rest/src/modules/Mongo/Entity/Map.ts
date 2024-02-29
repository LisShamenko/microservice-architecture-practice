import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, model, models } from 'mongoose';
// 
import { ActivityPointTypes } from '../enums/ActivityPointTypes';



//
@Schema({ _id: false })
export class SpawnPoint {
    @Prop() is_player: boolean;
    @Prop() is_enemy: boolean;
}
export const SpawnPointSchema = SchemaFactory.createForClass(SpawnPoint);

// 
@Schema({ _id: false })
export class TeleportPoint {
    @Prop() next_index: number;
    @Prop() prev_index: number;
}
export const TeleportPointSchema = SchemaFactory.createForClass(TeleportPoint);

// 
@Schema({ _id: false })
export class MapPoint {
    @Prop() index: number;
    @Prop() position: number[];
    @Prop() point_type: ActivityPointTypes;
    @Prop({ type: SpawnPointSchema })
    spawn: SpawnPoint | null;
    @Prop({ type: TeleportPointSchema })
    teleport: TeleportPoint | null;
}
export const MapPointSchema = SchemaFactory.createForClass(MapPoint);

// 
@Schema()
export class Map {
    _id: Types.ObjectId;
    @Prop() scene_id: string;
    @Prop() title: string;
    @Prop({ type: [MapPointSchema] })
    map_points: MapPoint[];
}

export const MapSchema = SchemaFactory.createForClass(Map);
export const MapModel = models['Map'] || model<Map>('Map', MapSchema);
export type MapDocument = HydratedDocument<Map>;
