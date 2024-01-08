import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
//
import { ActivityPointTypes } from '../enums/ActivityPointTypes';
import { Map } from './Map';
import { MapPoint } from './MapPoint';
import { ActivitySpawn } from './ActivitySpawn';
import { ActivityTeleport } from './ActivityTeleport';

//
@Entity('activity_points')
export class ActivityPoint extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column({
        name: 'point_type',
        type: 'enum',
        enum: ActivityPointTypes,
        default: ActivityPointTypes.none,
    })
    pointType: ActivityPointTypes;
    @Column() map_id: number;
    @Column() point_id: number;

    //
    @ManyToOne(() => Map, (map) => map.activityPoints)
    @JoinColumn({ name: 'map_id', referencedColumnName: 'id' })
    public map: Map;

    @OneToOne(() => MapPoint, (mapPoint) => mapPoint.activityPoint)
    @JoinColumn({ name: 'point_id', referencedColumnName: 'id' })
    public mapPoint: MapPoint;

    @OneToOne(() => ActivitySpawn, (spawn) => spawn.point)
    public spawn: ActivitySpawn;

    @OneToOne(() => ActivityTeleport, (teleport) => teleport.point)
    public teleport: ActivityTeleport;
}
