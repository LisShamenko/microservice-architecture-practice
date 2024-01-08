import { BaseEntity, Column, Entity } from 'typeorm';
import { PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
//
import { LevelTemplate } from './LevelTemplate';
import { Skill } from './Skill';

//
@Entity('level_template_skills')
export class LevelTemplateSkill extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() level_template_id: number;
    @Column() skill_id: number;

    // 
    @ManyToOne(() => LevelTemplate, (levelTemplate) => levelTemplate.skills)
    @JoinColumn({ name: 'level_template_id', referencedColumnName: 'id' })
    public levelTemplate: LevelTemplate;

    @ManyToOne(() => Skill, (skill) => skill.levelTemplates)
    @JoinColumn({ name: 'skill_id', referencedColumnName: 'id' })
    public skill: Skill;
}
