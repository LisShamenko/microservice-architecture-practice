import { BaseEntity, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
//
import { Game } from './Game';
import { SpawnScriptEnemy } from './SpawnScriptEnemy';

//
@Entity('spawn_scripts')
export class SpawnScript extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() title: string;

    //
    @OneToOne(() => Game, (game) => game.spawnScript)
    public game: Game;

    @OneToMany(() => SpawnScriptEnemy, (sse) => sse.spawnScript)
    public enemies: SpawnScriptEnemy[];
}
