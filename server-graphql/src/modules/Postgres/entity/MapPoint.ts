import { BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table } from 'sequelize-typescript';
//
import { Map } from './Map';
import { ActivityPoint } from './ActivityPoint';

//
@Table({ tableName: 'map_points' })
export class MapPoint extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) map_id: number;
    @Column({ type: DataType.ARRAY(DataType.REAL) }) position: number[];

    //
    @BelongsTo(() => Map, 'map_id') map: Map;
    @HasOne(() => ActivityPoint, 'point_id') activityPoint: ActivityPoint;
}
