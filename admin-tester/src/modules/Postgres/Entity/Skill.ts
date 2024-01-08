import { BaseEntity, Column, Entity, OneToMany } from 'typeorm';
import { JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
//
import { NullColumn } from '../decorators/NullColumn';
import { LevelTemplateSkill } from './LevelTemplateSkill';
import { PlayerSkill } from './PlayerSkill';
import { ProductSkill } from './ProductSkill';
import { Requirement } from './Requirement';

//
@Entity('skills')
export class Skill extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @NullColumn() title: string;
    @Column() requirement_id: number;
    @Column() parent_skill_id: number;

    //
    @ManyToOne(() => Requirement, (requirement) => requirement.skills)
    @JoinColumn({ name: 'requirement_id', referencedColumnName: 'id' })
    public requirement: Requirement;

    @ManyToOne(() => Skill, (skill) => skill.childSkills)
    @JoinColumn({ name: 'parent_skill_id', referencedColumnName: 'id' })
    public parentSkill: Skill; // tree

    //
    @OneToMany(() => ProductSkill, (products) => products.skill)
    public products: ProductSkill[];

    @OneToMany(() => Skill, (skill) => skill.parentSkill)
    public childSkills: Skill[]; // tree

    @OneToMany(() => PlayerSkill, (playerSkill) => playerSkill.skill)
    public players: PlayerSkill[];

    @OneToMany(() => LevelTemplateSkill, (lts) => lts.skill)
    public levelTemplates: LevelTemplateSkill[];
}
