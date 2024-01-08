import { BaseEntity, Column, Entity } from 'typeorm';
import { PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
//
import { NullColumn } from '../decorators/NullColumn';
import { Enemy } from './Enemy';
import { SpawnScript } from './SpawnScript';

//
@Entity('spawn_script_enemies')
export class SpawnScriptEnemy extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @NullColumn({ default: 0 }) count: number;
    @NullColumn({ default: 0 }) spawn_moment: number;
    @Column() script_id: number;
    @Column() enemy_id: number;

    //
    @ManyToOne(() => SpawnScript, (spawnScript) => spawnScript.enemies)
    @JoinColumn({ name: 'script_id', referencedColumnName: 'id' })
    public spawnScript: SpawnScript;

    @ManyToOne(() => Enemy, (enemy) => enemy.scripts)
    @JoinColumn({ name: 'enemy_id', referencedColumnName: 'id' })
    public enemy: Enemy;
}
