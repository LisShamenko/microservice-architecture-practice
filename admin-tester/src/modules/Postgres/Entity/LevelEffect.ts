import { BaseEntity, Column, Entity } from 'typeorm';
import { JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
//
import { NullColumn } from '../decorators/NullColumn';
import { PropertyColumns } from '../enums/PropertyColumns';
import { Player } from './Player';

//
@Entity('level_effects')
export class LevelEffect extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @NullColumn() public count_matches: number;
    @NullColumn() public is_equipment: boolean;
    @Column({
        type: 'enum',
        enum: PropertyColumns,
        default: PropertyColumns.none,
    })
    public property_column: PropertyColumns;
    @NullColumn() public delta_value: number;
    @Column() player_id: number;

    //
    @ManyToOne(() => Player, (player) => player.effects)
    @JoinColumn({ name: 'player_id', referencedColumnName: 'id' })
    public player: Player;
}
