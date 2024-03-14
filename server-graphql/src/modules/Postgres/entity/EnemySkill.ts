import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
//
import { Enemy } from './Enemy';
import { Skill } from './Skill';

//
@Table({ tableName: 'enemy_skills' })
export class EnemySkill extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @ForeignKey(() => Enemy) @Column({}) enemy_id: number;
    @ForeignKey(() => Skill) @Column({}) skill_id: number;

    //  
    @BelongsTo(() => Enemy, 'enemy_id') enemy: Enemy;
    @BelongsTo(() => Skill, 'skill_id') skill: Skill;
}
