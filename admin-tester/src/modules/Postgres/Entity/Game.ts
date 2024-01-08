import { BaseEntity, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
//
import { NullColumn } from '../decorators/NullColumn';
import { GameEnemy } from './GameEnemy';
import { GamePlayer } from './GamePlayer';
import { Map } from './Map';
import { SpawnScript } from './SpawnScript';

//
@Entity('games')
export class Game extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() map_id: number;
    @NullColumn() spawn_script_id: number;

    //
    @OneToOne(() => Map, (map) => map.game)
    @JoinColumn({ name: 'map_id', referencedColumnName: 'id' })
    public map: Map;

    @OneToOne(() => SpawnScript, (spawnScript) => spawnScript.game)
    @JoinColumn({ name: 'spawn_script_id', referencedColumnName: 'id' })
    public spawnScript: SpawnScript;

    //
    @OneToMany(() => GameEnemy, (gameEnemy) => gameEnemy.game)
    public enemies: GameEnemy[];

    @OneToMany(() => GamePlayer, (gamePlayer) => gamePlayer.game)
    public players: GamePlayer[];
}
