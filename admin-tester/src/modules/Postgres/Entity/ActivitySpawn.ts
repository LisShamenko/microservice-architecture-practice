import { BaseEntity, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
//
import { ActivityPoint } from './ActivityPoint';

//
@Entity('activity_spawns')
export class ActivitySpawn extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() is_player: boolean;
    @Column() is_enemy: boolean;
    @Column() activity_id: number;

    // 
    @OneToOne(() => ActivityPoint, (mapPoint) => mapPoint.spawn)
    @JoinColumn({ name: 'activity_id', referencedColumnName: 'id' })
    public point: ActivityPoint;
}
