import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
//
import { LevelTemplate } from './LevelTemplate';
import { Skill } from './Skill';

//
@Table({ tableName: 'level_template_skills' })
export class LevelTemplateSkill extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @ForeignKey(() => LevelTemplate) @Column({}) level_template_id: number;
    @ForeignKey(() => Skill) @Column({}) skill_id: number;

    //
    @BelongsTo(() => LevelTemplate, 'level_template_id') levelTemplate: LevelTemplate;
    @BelongsTo(() => Skill, 'skill_id') skill: Skill;
}
