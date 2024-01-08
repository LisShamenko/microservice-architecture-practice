import { BaseEntity, Column, Entity } from 'typeorm';
import { PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
//
import { Enemy } from './Enemy';
import { Skill } from './Skill';

//
@Entity('enemy_skills')
export class EnemySkill extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() enemy_id: number;
    @Column() skill_id: number;

    // 
    @ManyToOne(() => Enemy, (enemy) => enemy.skills)
    @JoinColumn({ name: 'enemy_id', referencedColumnName: 'id' })
    public enemy: Enemy;

    @ManyToOne(() => Skill, (skill) => skill.enemies)
    @JoinColumn({ name: 'skill_id', referencedColumnName: 'id' })
    public skill: Skill;
}
