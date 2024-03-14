import { BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
//
import { GamePlayer } from './GamePlayer';
import { Map } from './Map';
import { Player } from './Player';
import { SpawnScript } from './SpawnScript';

//
@Table({ tableName: 'games' })
export class Game extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) map_id: number;
    @Column({}) spawn_script_id: number;
    @Column({}) owner_player_id: number;

    //
    @BelongsTo(() => Map, 'map_id') map: Map;
    @BelongsTo(() => SpawnScript, 'spawn_script_id') spawnScript: SpawnScript;
    @BelongsTo(() => Player, 'owner_player_id') ownerPlayer: Player;

    //
    @HasMany(() => GamePlayer, 'game_id') linkGamePlayer: GamePlayer[];
    @BelongsToMany(() => Player, () => GamePlayer) players: Player[];
}
