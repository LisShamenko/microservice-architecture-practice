import { Column, HasOne, Model, Table } from 'sequelize-typescript';
//
import { Enemy } from './Enemy';
import { LevelTemplate } from './LevelTemplate';
import { Player } from './Player';



//
@Table({ tableName: 'player_properties' })
export class PlayerProperty extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) strength: number;
    @Column({}) endurance: number;
    @Column({}) intelligence: number;
    @Column({}) agility: number;
    @Column({}) fire_weapons: number;
    @Column({}) melee_weapons: number;
    @Column({}) throwing: number;
    @Column({}) doctor: number;
    @Column({}) sneak: number;
    @Column({}) steal: number;
    @Column({}) traps: number;
    @Column({}) science: number;
    @Column({}) repair: number;
    @Column({}) barter: number;

    //
    @HasOne(() => Enemy, 'properties_id') enemy: Enemy;
    @HasOne(() => Player, 'properties_id') player: Player;
    @HasOne(() => LevelTemplate, 'properties_id') levelTemplate: LevelTemplate;

    // 
    static attributes: string[] = [
        'strength', 'endurance', 'intelligence', 'agility'
    ];

    static parameters: string[] = [
        'fire_weapons', 'melee_weapons', 'throwing', 'doctor',
        'sneak', 'steal', 'traps', 'science', 'repair', 'barter'
    ];
}
