import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';
//
import { InsertSpawnDto } from './dto/InsertSpawnDto';
import { UpdateSpawnDto } from './dto/UpdateSpawnDto';
import { SpawnScript } from '../../modules/Postgres/entity/SpawnScript';
import { Enemy } from '../../modules/Postgres/entity/Enemy';
import { SpawnScriptEnemy } from '../../modules/Postgres/entity/SpawnScriptEnemy';
import { ErrorHelper } from '../services/ErrorHelper';

//
@Injectable()
export class SpawnScriptService {
    constructor(
        @InjectDataSource('postgres_db') private dataSource: DataSource,
        private errorHelper: ErrorHelper,
    ) { }

    // 
    async insertSpawnScript(idto: InsertSpawnDto) {

        const enemy_ids = idto.waves.map(w => w.enemy_id);
        const enemies = await this.dataSource.getRepository(Enemy).find({
            select: { id: true },
            where: { id: In(enemy_ids) }
        });
        this.errorHelper.foundArrayError(enemies, 'enemy_ids');

        // 
        const spawnScript = new SpawnScript();
        spawnScript.title = idto.title;

        const addWaves: SpawnScriptEnemy[] = [];
        idto.waves.forEach(idto_w => {
            const tmpEnemy = enemies.find(e => e.id === idto_w.enemy_id);

            if (tmpEnemy) {
                const wave = new SpawnScriptEnemy();
                wave.count = idto_w.count;
                wave.enemy_id = idto_w.enemy_id;
                wave.spawn_moment = idto_w.spawn_moment;
                addWaves.push(wave);
            }
        });

        //
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(spawnScript);
            if (addWaves.length > 0) {
                addWaves.forEach(w => { w.script_id = spawnScript.id });
                await queryRunner.manager.save(addWaves);
            }
            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.errorHelper.transactionError(err.message);
        }
        finally {
            await queryRunner.release();
        }
        return { id: spawnScript.id };
    }

    // 
    async updateSpawnScript(spawn_id: number, udto: UpdateSpawnDto) {

        const enemy_ids = udto.waves.map(w => w.enemy_id);
        const enemies = await this.dataSource.getRepository(Enemy).find({
            select: { id: true },
            where: { id: In(enemy_ids) }
        });
        this.errorHelper.foundArrayError(enemies, 'enemy_ids');

        // 
        const spawnScript = await this.dataSource.getRepository(SpawnScript)
            .findOne({
                where: { id: spawn_id },
                relations: { enemies: true },
            });
        this.errorHelper.foundError(spawnScript, 'spawn_id');

        // 
        const addWaves: SpawnScriptEnemy[] = [];
        udto.waves.forEach(udto_w => {
            if (enemies.every(e => e.id !== udto_w.enemy_id)) return;

            if (udto_w.id) {
                const wave = spawnScript.enemies.find(w => w.id === udto_w.id);
                if (wave) {
                    wave.count = udto_w.count;
                    wave.enemy_id = udto_w.enemy_id;
                    wave.spawn_moment = udto_w.spawn_moment;
                    wave.script_id = spawnScript.id;
                    wave.spawnScript = spawnScript;
                    addWaves.push(wave);
                }
            }
            else {
                const wave = new SpawnScriptEnemy();
                wave.count = udto_w.count;
                wave.enemy_id = udto_w.enemy_id;
                wave.spawn_moment = udto_w.spawn_moment;
                wave.script_id = spawnScript.id;
                wave.spawnScript = spawnScript;
                addWaves.push(wave);
            }
        })

        // 
        const wave_ids = udto.waves.map(w => w.id);
        const removeWaves = spawnScript.enemies
            .filter(e => !wave_ids.includes(e.id));

        // 
        if (udto.title) spawnScript.title = udto.title;

        //
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if (removeWaves && removeWaves.length > 0) {
                await queryRunner.manager.remove(removeWaves);
            }
            await queryRunner.manager.save(addWaves);
            spawnScript.enemies = undefined;
            await queryRunner.manager.save(spawnScript);
            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.errorHelper.transactionError(err.message);
        }
        finally {
            await queryRunner.release();
        }
        return { id: spawnScript.id };
    }

    // 
    async deleteSpawnScript(spawn_id: number) {
        try {
            const result = await this.dataSource.getRepository(SpawnScript)
                .delete({ id: spawn_id });
            return { rows: result.affected };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }

    // 
    async getOneSpawnScript(spawn_id: number) {
        const spawn = await this.dataSource.getRepository(SpawnScript)
            .findOne({
                where: { id: spawn_id },
                relations: { enemies: true },
            });
        this.errorHelper.foundError(spawn, 'spawn_id');

        return {
            id: spawn.id,
            title: spawn.title,
            waves: spawn.enemies.map(e => ({
                id: e.id,
                count: e.count,
                spawn_moment: e.spawn_moment,
                enemy_id: e.enemy_id
            })),
        };
    }

    // 
    async getAllSpawnScripts() {
        const spawns = await this.dataSource.getRepository(SpawnScript).find();
        return {
            spawn_scripts: (!spawns) ? [] : spawns.map(s => ({
                id: s.id,
                title: s.title,
            }))
        }
    }
}
