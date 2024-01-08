import { BaseEntity, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
//
import { NullColumn } from '../decorators/NullColumn';
import { Enemy } from './Enemy';
import { Inventory } from './Inventory';
import { LevelTemplateSkill } from './LevelTemplateSkill';
import { Player } from './Player';
import { PlayerProperty } from './PlayerProperty';

//
@Entity('level_templates')
export class LevelTemplate extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @NullColumn() title: string;
    @Column() coins: number;
    @Column() properties_id: number;
    @Column() inventory_id: number;

    //
    @OneToOne(() => PlayerProperty, (playerProperty) => playerProperty.levelTemplate)
    @JoinColumn({ name: 'properties_id', referencedColumnName: 'id' })
    public playerProperty: PlayerProperty;

    @OneToOne(() => Inventory, (inventory) => inventory.levelTemplate)
    @JoinColumn({ name: 'inventory_id', referencedColumnName: 'id' })
    public inventory: Inventory;

    //
    @OneToOne(() => Enemy, (enemy) => enemy.levelTemplate)
    public enemy: Enemy;

    @OneToOne(() => Player, (player) => player.levelTemplate)
    public player: Player;

    @OneToMany(() => LevelTemplateSkill, (lts) => lts.levelTemplate)
    public skills: LevelTemplateSkill[];
}
