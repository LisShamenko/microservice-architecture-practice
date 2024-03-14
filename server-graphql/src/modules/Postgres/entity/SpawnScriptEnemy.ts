import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
//
import { Enemy } from './Enemy';
import { SpawnScript } from './SpawnScript';

//
@Table({ tableName: 'spawn_script_enemies' })
export class SpawnScriptEnemy extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({ defaultValue: 0 }) count: number;
    @Column({ defaultValue: 0 }) spawn_moment: number;
    @ForeignKey(() => SpawnScript) @Column({}) script_id: number;
    @ForeignKey(() => Enemy) @Column({}) enemy_id: number;

    //  
    @BelongsTo(() => SpawnScript, 'script_id') spawnScript: SpawnScript;
    @BelongsTo(() => Enemy, 'enemy_id') enemy: Enemy;
}
