import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
//
import { ActivityPoint } from './ActivityPoint';

//
@Table({ tableName: 'activity_spawns' })
export class ActivitySpawn extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) is_player: boolean;
    @Column({}) is_enemy: boolean;
    @Column({}) activity_id: number;

    // 
    @BelongsTo(() => ActivityPoint, 'activity_id') point: ActivityPoint;
}
