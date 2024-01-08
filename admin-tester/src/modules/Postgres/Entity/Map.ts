import { BaseEntity, Entity, OneToMany, OneToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
//
import { NullColumn } from '../decorators/NullColumn';
import { Game } from './Game';
import { MapPoint } from './MapPoint';

//
@Entity('maps')
export class Map extends BaseEntity {
    @PrimaryGeneratedColumn() public id: number;
    @NullColumn() scene_id: number;

    //
    @OneToMany(() => MapPoint, (mapPoint) => mapPoint.map)
    public points: MapPoint[];

    @OneToOne(() => Game, (game) => game.map)
    public game: Game;
}
