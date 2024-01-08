import { BaseEntity, Entity, OneToMany, OneToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
//
import { NullColumn } from '../decorators/NullColumn';
import { Game } from './Game';
import { MapPoint } from './MapPoint';
import { ActivityPoint } from './ActivityPoint';

//
@Entity('maps')
export class Map extends BaseEntity {
    @PrimaryGeneratedColumn() public id: number;
    @NullColumn() scene_id: number;
    @NullColumn() title: string;

    //
    @OneToMany(() => MapPoint, (mapPoint) => mapPoint.map)
    public points: MapPoint[];

    @OneToMany(() => ActivityPoint, (mapPoint) => mapPoint.map)
    public activityPoints: ActivityPoint[];

    @OneToOne(() => Game, (game) => game.map)
    public game: Game;
}
