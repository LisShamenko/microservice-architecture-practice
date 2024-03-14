import { BelongsToMany, Column, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
//
import { Game } from './Game';
import { SpawnScriptEnemy } from './SpawnScriptEnemy';
import { Enemy } from './Enemy';



//
@Table({ tableName: 'spawn_scripts' })
export class SpawnScript extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) title: string;

    //
    @HasOne(() => Game, 'spawn_script_id') game: Game;
    
    // 
    @HasMany(() => SpawnScriptEnemy, 'script_id') linkEnemies: SpawnScriptEnemy[];
    @BelongsToMany(() => Enemy, () => SpawnScriptEnemy) enemies: Enemy[];
}
