import { BaseEntity, Column, Entity } from 'typeorm';
import { PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
//
import { Player } from './Player';
import { Skill } from './Skill';

//
@Entity('player_skills')
export class PlayerSkill extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() player_id: number;
    @Column() skill_id: number;

    // 
    @ManyToOne(() => Player, (player) => player.skills)
    @JoinColumn({ name: 'player_id', referencedColumnName: 'id' })
    public player: Player;

    @ManyToOne(() => Skill, (skill) => skill.players)
    @JoinColumn({ name: 'skill_id', referencedColumnName: 'id' })
    public skill: Skill;
}
