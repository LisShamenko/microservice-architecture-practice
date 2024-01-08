import { BaseEntity, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
//
import { ActivityPoint } from './ActivityPoint';
import { NullColumn } from '../decorators/NullColumn';

//
@Entity('activity_teleports')
export class ActivityTeleport extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @NullColumn() next_activity_id: number;
    @NullColumn() prev_activity_id: number;
    @Column() activity_id: number;

    // 
    @OneToOne(() => ActivityPoint)
    @JoinColumn({ name: 'next_activity_id', referencedColumnName: 'id' })
    public next: ActivityPoint;

    @OneToOne(() => ActivityPoint)
    @JoinColumn({ name: 'prev_activity_id', referencedColumnName: 'id' })
    public prev: ActivityPoint;

    @OneToOne(() => ActivityPoint, (mapPoint) => mapPoint.teleport)
    @JoinColumn({ name: 'activity_id', referencedColumnName: 'id' })
    public point: ActivityPoint;
}
