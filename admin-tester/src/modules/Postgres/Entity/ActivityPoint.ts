import { BaseEntity, Column, Entity, OneToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
//
import { ActivityPointTypes } from '../enums/ActivityPointTypes';
import { MapPoint } from './MapPoint';

//
@Entity('activity_point')
export class ActivityPoint extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column({
        name: 'point_type',
        type: 'enum',
        enum: ActivityPointTypes,
        default: ActivityPointTypes.none,
    })
    pointType: ActivityPointTypes;

    //
    @OneToMany(() => MapPoint, (mapPoint) => mapPoint.point)
    public maps: MapPoint[];
}
