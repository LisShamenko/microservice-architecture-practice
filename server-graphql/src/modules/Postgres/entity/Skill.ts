import { BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
//

import { EnemySkill } from './EnemySkill';
import { LevelTemplateSkill } from './LevelTemplateSkill';
import { PlayerSkill } from './PlayerSkill';
import { ProductSkill } from './ProductSkill';
import { Requirement } from './Requirement';
import { Enemy } from './Enemy';
import { Product } from './Product';
import { Player } from './Player';
import { LevelTemplate } from './LevelTemplate';

//
@Table({ tableName: 'skills' })
export class Skill extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) title: string;
    @Column({}) requirement_id: number;
    @Column({}) parent_skill_id: number;

    //
    @BelongsTo(() => Requirement, 'requirement_id') requirement: Requirement;

    // tree
    @BelongsTo(() => Skill, 'parent_skill_id') parentSkill: Skill;
    @HasMany(() => Skill, 'parent_skill_id') childSkills: Skill[];

    // 
    @HasMany(() => ProductSkill, 'skill_id') linkProductSkill: ProductSkill[];
    @BelongsToMany(() => Product, () => ProductSkill) products: Product[];

    @HasMany(() => PlayerSkill, 'skill_id') linkPlayerSkill: PlayerSkill[];
    @BelongsToMany(() => Player, () => PlayerSkill) players: Player[];

    @HasMany(() => EnemySkill, 'skill_id') linkEnemySkill: EnemySkill[];
    @BelongsToMany(() => Enemy, () => EnemySkill) enemies: Enemy[];

    @HasMany(() => LevelTemplateSkill, 'skill_id') linkLevelTemplateSkill: LevelTemplateSkill[];
    @BelongsToMany(() => LevelTemplate, () => LevelTemplateSkill) levelTemplates: LevelTemplate[];
}
