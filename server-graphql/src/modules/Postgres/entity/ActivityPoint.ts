import { HasOne, BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
//
import { ActivityPointTypes } from '../enums/ActivityPointTypes';
import { Map } from './Map';
import { MapPoint } from './MapPoint';
import { ActivitySpawn } from './ActivitySpawn';
import { ActivityTeleport } from './ActivityTeleport';

//
@Table({ tableName: 'activity_points' })
export class ActivityPoint extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({
        field: 'point_type',
        type: DataType.ENUM(...Object.values(ActivityPointTypes)),
        defaultValue: ActivityPointTypes.none,
    })
    pointType: ActivityPointTypes;
    @Column({}) map_id: number;
    @Column({}) point_id: number;

    //
    @BelongsTo(() => Map, 'map_id') map: Map;
    @BelongsTo(() => MapPoint, 'point_id') mapPoint: MapPoint;
    @HasOne(() => ActivitySpawn, 'activity_id') spawn: ActivitySpawn;
    @HasOne(() => ActivityTeleport, 'activity_id') teleport: ActivityTeleport;
}
