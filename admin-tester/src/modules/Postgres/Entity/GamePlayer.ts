import { BaseEntity, Column, Entity } from 'typeorm';
import { PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
//
import { Game } from './Game';
import { Player } from './Player';

//
@Entity('game_players')
export class GamePlayer extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() game_id: number;
    @Column() player_id: number;

    // 
    @ManyToOne(() => Game, (game) => game.players, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'game_id', referencedColumnName: 'id' })
    public game: Game;

    @ManyToOne(() => Player, (player) => player.games)
    @JoinColumn({ name: 'player_id', referencedColumnName: 'id' })
    public player: Player;
}
