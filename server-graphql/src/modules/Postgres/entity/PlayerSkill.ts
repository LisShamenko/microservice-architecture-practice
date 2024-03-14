import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
//
import { Player } from './Player';
import { Skill } from './Skill';

//
@Table({ tableName: 'player_skills' })
export class PlayerSkill extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @ForeignKey(() => Player) @Column({}) player_id: number;
    @ForeignKey(() => Skill) @Column({}) skill_id: number;

    //  
    @BelongsTo(() => Player, 'player_id') player: Player;
    @BelongsTo(() => Skill, 'skill_id') skill: Skill;
}
