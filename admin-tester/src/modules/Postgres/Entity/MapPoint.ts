import { BaseEntity, Column, Entity, OneToOne } from 'typeorm';
import { JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
//
import { Map } from './Map';
import { ActivityPoint } from './ActivityPoint';

//
@Entity('map_points')
export class MapPoint extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() map_id: number;
    @Column({ type: 'real', array: true }) position: number[];

    //
    @ManyToOne(() => Map, (map) => map.points)
    @JoinColumn({ name: 'map_id', referencedColumnName: 'id' })
    public map: Map;

    @OneToOne(() => ActivityPoint, (activityPoint) => activityPoint.mapPoint)
    public activityPoint: ActivityPoint;
}
