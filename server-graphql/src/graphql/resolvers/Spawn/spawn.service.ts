import { Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { PaginatorArgs } from 'nestjs-graphql-tools';
// 
import { SpawnScript } from '../../../modules/Postgres/entity/SpawnScript';
import { SpawnScriptEnemy } from '../../../modules/Postgres/entity/SpawnScriptEnemy';
import { ErrorHelper } from '../services/ErrorHelper';
import { MapHelper } from '../services/MapHelper';
import { NewSpawnScriptInput, SpawnScriptObject, SpawnWaveInput, UpdateSpawnScriptInput } from './spawn.objects';



// 
@Injectable()
export class SpawnScriptService {
    private repoScript: Repository<SpawnScript>;
    private repoSpawnScriptEnemy: Repository<SpawnScriptEnemy>;

    constructor(
        private sequelize: Sequelize,
        private mapHelper: MapHelper,
        private errorHelper: ErrorHelper,
    ) {
        this.repoScript = this.sequelize.getRepository(SpawnScript);
        this.repoSpawnScriptEnemy = this.sequelize.getRepository(SpawnScriptEnemy);
    }

    // 
    async insertSpawnScript(idto: NewSpawnScriptInput) {

        const tmpWaves: SpawnScriptEnemy[] =
            await this.mapHelper.addWaves(idto.waves);

        const spawnScript = new SpawnScript();
        spawnScript.title = idto.title;

        // 
        const t = await this.sequelize.transaction();
        try {

            await spawnScript.save({ transaction: t });

            if (tmpWaves.length > 0) {
                for (const w of tmpWaves) {
                    w.script_id = spawnScript.id;
                    await w.save({ transaction: t });
                }
            }

            await t.commit();
            return spawnScript;
        }
        catch (err) {
            await t.rollback();
            this.errorHelper.transactionError(err.message);
        }
    }

    async updateSpawnScript(udto: UpdateSpawnScriptInput) {

        const spawnScript = await this.repoScript.findOne({
            where: { id: udto.script_id },
            include: ['linkEnemies'],
        });
        this.errorHelper.foundError(spawnScript, 'spawn_id');

        //  
        const removeWaves: SpawnWaveInput[] = [];
        spawnScript.linkEnemies.forEach(le => {
            const ind = udto.waves.findIndex(w => (w.id === le.id));
            if (ind < 0) removeWaves.push(le);
        });

        const addWaves = await this.mapHelper.addWaves(udto.waves);

        if (udto.title) spawnScript.title = udto.title;

        // 
        const t = await this.sequelize.transaction();
        try {

            await this.repoSpawnScriptEnemy.destroy({
                where: { id: removeWaves.map(w => w.id) },
                transaction: t,
            });

            if (addWaves.length > 0) {
                for (const w of addWaves) {
                    w.script_id = spawnScript.id;
                    if (w.id) await w.update({ transaction: t });
                    else await w.save({ transaction: t });
                }
            }

            await spawnScript.save({ transaction: t });

            await t.commit();
            return spawnScript;
        }
        catch (err) {
            await t.rollback();
            this.errorHelper.transactionError(err.message);
        }
    }

    async getOneSpawnScript(spawn_id: number): Promise<SpawnScriptObject> {
        return await this.repoScript.findOne({ where: { id: spawn_id } });
    }

    async getAllSpawnScripts(paginator: PaginatorArgs): Promise<SpawnScriptObject[]> {
        if (paginator) {
            return await this.repoScript.findAll({
                offset: paginator.page * paginator.per_page,
                limit: paginator.per_page,
            });
        }
        return await this.repoScript.findAll();
    }

    async deleteSpawnScript(spawn_id: number) {
        try {
            const result = await this.repoScript.destroy({
                where: { id: spawn_id },
                force: true,
            });
            return { rows: result };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }
}
