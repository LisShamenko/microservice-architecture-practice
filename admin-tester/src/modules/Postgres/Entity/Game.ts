import { BaseEntity, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
//
import { GamePlayer } from './GamePlayer';
import { Map } from './Map';
import { Player } from './Player';
import { SpawnScript } from './SpawnScript';

//
@Entity('games')
export class Game extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() map_id: number;
    @Column() spawn_script_id: number;
    @Column() owner_player_id: number;

    //
    @OneToOne(() => Map, (map) => map.game)
    @JoinColumn({ name: 'map_id', referencedColumnName: 'id' })
    public map: Map;

    @OneToOne(() => SpawnScript, (spawnScript) => spawnScript.game)
    @JoinColumn({ name: 'spawn_script_id', referencedColumnName: 'id' })
    public spawnScript: SpawnScript;

    @OneToOne(() => Player, (ownerPlayer) => ownerPlayer.game)
    @JoinColumn({ name: 'owner_player_id', referencedColumnName: 'id' })
    public ownerPlayer: Player;

    //
    @OneToMany(() => GamePlayer, (gamePlayer) => gamePlayer.game)
    public players: GamePlayer[];
}
