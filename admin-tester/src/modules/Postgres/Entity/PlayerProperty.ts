import { BaseEntity, Entity, OneToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
//
import { NullColumn } from '../decorators/NullColumn';
import { Enemy } from './Enemy';
import { LevelTemplate } from './LevelTemplate';
import { Player } from './Player';

//
@Entity('player_properties')
export class PlayerProperty extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @NullColumn() strength: number;
    @NullColumn() endurance: number;
    @NullColumn() intelligence: number;
    @NullColumn() agility: number;
    @NullColumn({ name: 'fire_weapons' }) fireWeapons: number;
    @NullColumn() melee_weapons: number;
    @NullColumn() throwing: number;
    @NullColumn() doctor: number;
    @NullColumn() sneak: number;
    @NullColumn() steal: number;
    @NullColumn() traps: number;
    @NullColumn() science: number;
    @NullColumn() repair: number;
    @NullColumn() barter: number;

    //
    @OneToOne(() => Enemy, (enemy) => enemy.playerProperty)
    public enemy: Enemy;

    @OneToOne(() => LevelTemplate, (levelTemplate) => levelTemplate.playerProperty)
    public levelTemplate: LevelTemplate;

    @OneToOne(() => Player, (player) => player.playerProperty)
    public player: Player;
}