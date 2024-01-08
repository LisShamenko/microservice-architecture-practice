import { BaseEntity, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
//
import { EnemyTypes } from '../enums/EnemyTypes';
import { EnemySkill } from './EnemySkill';
import { Inventory } from './Inventory';
import { LevelTemplate } from './LevelTemplate';
import { PlayerProperty } from './PlayerProperty';
import { SpawnScriptEnemy } from './SpawnScriptEnemy';

//
@Entity('enemies')
export class Enemy extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column({
        type: 'enum',
        enum: EnemyTypes,
        default: EnemyTypes.Test,
    })
    enemy_type: EnemyTypes;
    @Column() nickname: string;
    @Column() inventory_id: number;
    @Column() properties_id: number;
    @Column() level_template_id: number;

    //
    @OneToOne(() => Inventory, (inventory) => inventory.enemy)
    @JoinColumn({ name: 'inventory_id', referencedColumnName: 'id' })
    public inventory: Inventory;

    @OneToOne(() => PlayerProperty, (playerProperty) => playerProperty.enemy)
    @JoinColumn({ name: 'properties_id', referencedColumnName: 'id' })
    public playerProperty: PlayerProperty;

    @OneToOne(() => LevelTemplate, (levelTemplate) => levelTemplate.enemy)
    @JoinColumn({ name: 'level_template_id', referencedColumnName: 'id' })
    public levelTemplate: LevelTemplate;

    //
    @OneToMany(() => SpawnScriptEnemy, (sse) => sse.enemy)
    public scripts: SpawnScriptEnemy[];

    @OneToMany(() => EnemySkill, (enemySkill) => enemySkill.enemy)
    public skills: EnemySkill[];
}
