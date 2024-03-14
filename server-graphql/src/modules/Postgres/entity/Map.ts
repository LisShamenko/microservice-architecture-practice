import { BelongsTo, Column, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
//

import { Game } from './Game';
import { MapPoint } from './MapPoint';
import { ActivityPoint } from './ActivityPoint';

//
@Table({ tableName: 'maps' })
export class Map extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) scene_id: number;
    @Column({}) title: string;

    //
    @HasOne(() => Game, 'map_id') game: Game;
    @HasMany(() => MapPoint, 'map_id') points: MapPoint[];
    @HasMany(() => ActivityPoint, 'map_id') activityPoints: ActivityPoint[];
}
