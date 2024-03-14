import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
//
import { EnemyTypes } from '../enums/EnemyTypes';
import { EnemySkill } from './EnemySkill';
import { Inventory } from './Inventory';
import { LevelTemplate } from './LevelTemplate';
import { PlayerProperty } from './PlayerProperty';
import { SpawnScriptEnemy } from './SpawnScriptEnemy';
import { SpawnScript } from './SpawnScript';
import { Skill } from './Skill';

//
@Table({ tableName: 'enemies' })
export class Enemy extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({
        type: DataType.ENUM(...Object.values(EnemyTypes)),
        defaultValue: EnemyTypes.Test,
    })
    enemy_type: EnemyTypes;
    @Column({}) nickname: string;
    @Column({}) inventory_id: number;
    @Column({}) properties_id: number;
    @Column({}) level_template_id: number;

    //
    @BelongsTo(() => Inventory, 'inventory_id') inventory: Inventory;
    @BelongsTo(() => PlayerProperty, 'properties_id') playerProperty: PlayerProperty;
    @BelongsTo(() => LevelTemplate, 'level_template_id') levelTemplate: LevelTemplate;

    //
    @HasMany(() => SpawnScriptEnemy, 'enemy_id') linkSpawnScriptEnemy: SpawnScriptEnemy[];
    @BelongsToMany(() => SpawnScript, () => SpawnScriptEnemy) scripts: SpawnScript[];

    @HasMany(() => EnemySkill, 'enemy_id') linkEnemySkill: EnemySkill[];
    @BelongsToMany(() => Skill, () => EnemySkill) skills: Skill[];
}
