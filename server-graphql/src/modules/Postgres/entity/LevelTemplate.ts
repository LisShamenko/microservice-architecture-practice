import { BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
//
import { Enemy } from './Enemy';
import { Inventory } from './Inventory';
import { LevelTemplateSkill } from './LevelTemplateSkill';
import { Player } from './Player';
import { PlayerProperty } from './PlayerProperty';
import { Skill } from './Skill';



//
@Table({ tableName: 'level_templates' })
export class LevelTemplate extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) title: string;
    @Column({}) coins: number;
    @Column({}) properties_id: number;
    @Column({}) inventory_id: number;

    //
    @BelongsTo(() => PlayerProperty, 'properties_id') playerProperty: PlayerProperty;
    @BelongsTo(() => Inventory, 'inventory_id') inventory: Inventory;

    //
    @HasOne(() => Enemy, 'level_template_id') enemy: Enemy;
    @HasOne(() => Player, 'level_template_id') player: Player;

    // 
    @HasMany(() => LevelTemplateSkill, 'level_template_id') linkLevelTemplateSkill: LevelTemplateSkill[];
    @BelongsToMany(() => Skill, () => LevelTemplateSkill) skills: Skill[];
}
