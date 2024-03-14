import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
//
import { Game } from './Game';
import { Player } from './Player';

//
@Table({ tableName: 'game_players' })
export class GamePlayer extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @ForeignKey(() => Game) @Column({}) game_id: number;
    @ForeignKey(() => Player) @Column({}) player_id: number;

    //  
    @BelongsTo(() => Game, 'game_id') game: Game;
    @BelongsTo(() => Player, 'player_id') player: Player;
}
