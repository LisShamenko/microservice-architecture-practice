import { BaseEntity, Column, Entity } from 'typeorm';
import { PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
//
import { Enemy } from './Enemy';
import { Game } from './Game';

//
@Entity('game_enemies')
export class GameEnemy extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() game_id: number;
    @Column() enemy_id: number;

    // 
    @ManyToOne(() => Game, (game) => game.enemies)
    @JoinColumn({ name: 'game_id', referencedColumnName: 'id' })
    public game: Game;

    @ManyToOne(() => Enemy, (enemy) => enemy.games)
    @JoinColumn({ name: 'enemy_id', referencedColumnName: 'id' })
    public enemy: Enemy;
}
