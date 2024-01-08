import { BaseEntity, Column, Entity } from 'typeorm';
import { JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
//
import { ActivityPoint } from './ActivityPoint';
import { NullColumn } from '../decorators/NullColumn';
import { Map } from './Map';

//
@Entity('map_points')
export class MapPoint extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @NullColumn() title: string;
    @Column({ type: 'real', array: true }) position: number[];
    @Column() map_id: number;
    @Column() point_id: number;

    //
    @ManyToOne(() => Map, (map) => map.points)
    @JoinColumn({ name: 'map_id', referencedColumnName: 'id' })
    public map: Map;

    @ManyToOne(() => ActivityPoint, (point) => point.maps)
    @JoinColumn({ name: 'point_id', referencedColumnName: 'id' })
    public point: ActivityPoint;
}
