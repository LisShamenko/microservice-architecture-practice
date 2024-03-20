import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//
import { InsertSpawnDto } from './dto/InsertSpawnDto';
import { UpdateSpawnDto } from './dto/UpdateSpawnDto';
import { SpawnScript, SpawnScriptDocument, SpawnScriptEnemy } from '../../modules/Mongo/entity/SpawnScript';
import { Enemy, EnemyDocument } from '../../modules/Mongo/entity/Enemy';
import { MapHelper } from '../services/MapHelper';
import { ErrorHelper } from '../services/ErrorHelper';
import { RedisRepository } from 'src/modules/RedisClient/redis.repository';
import { Prefix } from '../enums/prefix.enum';



//
@Injectable()
export class SpawnScriptService {
    constructor(
        @InjectModel(Enemy.name, 'db')
        private enemyModel: Model<EnemyDocument>,
        @InjectModel(SpawnScript.name, 'db')
        private spawnScriptModel: Model<SpawnScriptDocument>,
        private mapHelper: MapHelper,
        private errorHelper: ErrorHelper,
        @Inject(RedisRepository)
        private repository: RedisRepository,
    ) { }

    // admin
    async insertSpawnScript(idto: InsertSpawnDto) {

        const tmpWaves: SpawnScriptEnemy[] =
            await this.mapHelper.addWaves(idto.waves);

        const spawnScript = new SpawnScript();
        spawnScript.title = idto.title;
        spawnScript.waves = tmpWaves;

        //
        const newScript = new this.spawnScriptModel(spawnScript);
        const result = await newScript.save();
        return { id: result.id };
    }

    // admin
    async updateSpawnScript(spawn_id: string, udto: UpdateSpawnDto) {

        const spawnScript = await this.spawnScriptModel
            .where({ _id: spawn_id })
            .findOne();
        this.errorHelper.foundError(spawnScript, 'spawn_id');

        // 
        spawnScript.waves = await this.mapHelper.addWaves(udto.waves);
        if (udto.title) spawnScript.title = udto.title;

        //
        const result = await spawnScript.save();
        return { id: result.id };
    }

    // admin
    async deleteSpawnScript(spawn_id: string) {
        try {
            const result = await this.spawnScriptModel
                .deleteOne({ _id: spawn_id });
            return { rows: result.deletedCount };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }

    // user, admin
    async getOneSpawnScript(spawn_id: string) {

        let result = await this.repository.getObject(Prefix.spawnScript, spawn_id);
        if (!result) {

            const spawn = await this.spawnScriptModel
                .where({ _id: spawn_id })
                .findOne();
            this.errorHelper.foundError(spawn, 'spawn_id');

            result = {
                id: spawn.id,
                title: spawn.title,
                waves: spawn.waves.map(e => ({
                    id: e._id,
                    count: e.count,
                    spawn_moment: e.spawn_moment,
                    enemy_id: e.enemy_id
                })),
            };
            await this.repository.saveObject(Prefix.spawnScript, spawn.id, result);
        }
        return result;
    }

    // user, admin
    async getAllSpawnScripts() {

        let result = await this.repository.getList(Prefix.spawnScript);
        if (!result) {

            const spawns = await this.spawnScriptModel
                .find();

            result = {
                spawn_scripts: (!spawns) ? [] : spawns.map(s => ({
                    id: s.id,
                    title: s.title,
                }))
            }
            await this.repository.saveList(Prefix.spawnScript, result);
        }
        return result;
    }
}
