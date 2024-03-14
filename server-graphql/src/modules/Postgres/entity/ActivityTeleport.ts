import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
//
import { ActivityPoint } from './ActivityPoint';


//
@Table({ tableName: 'activity_teleports' })
export class ActivityTeleport extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) next_activity_id: number;
    @Column({}) prev_activity_id: number;
    @Column({}) activity_id: number;

    // 
    @BelongsTo(() => ActivityPoint, 'next_activity_id') next: ActivityPoint;
    @BelongsTo(() => ActivityPoint, 'prev_activity_id') prev: ActivityPoint;
    @BelongsTo(() => ActivityPoint, 'activity_id') point: ActivityPoint;
}
