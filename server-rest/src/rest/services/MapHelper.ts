import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
// 
import { Enemy, EnemyDocument } from '../../modules/Mongo/entity/Enemy';
import { SpawnWaveDto } from "../dto/SpawnWaveDto";
import { PointItemDto } from "../dto/PointItemDto";
import { SpawnPoint, TeleportPoint, MapPoint } from "../../modules/Mongo/entity/Map";
import { ActivityPointTypes } from "../../modules/Mongo/enums/ActivityPointTypes";
import { SpawnScriptEnemy } from "../../modules/Mongo/Entity/SpawnScript";
import { ErrorHelper } from "./ErrorHelper";



// 
@Injectable()
export class MapHelper {
    constructor(
        @InjectModel(Enemy.name, 'db')
        private enemyModel: Model<EnemyDocument>,
        private errorHelper: ErrorHelper,
    ) { }

    // 
    async addWaves(dtoWaves: SpawnWaveDto[]) {
        if (!dtoWaves || dtoWaves.length <= 0) return;

        const enemy_ids = dtoWaves.map(w => new Types.ObjectId(w.enemy_id));
        const enemies = await this.enemyModel.find({
            _id: { $in: enemy_ids },
        });
        this.errorHelper.foundArrayError(enemies, 'enemy_ids');

        const tmpWaves: SpawnScriptEnemy[] = [];
        dtoWaves.forEach(dto_w => {

            const curEnemy = enemies.find(e => e.id === dto_w.enemy_id);
            if (curEnemy) {

                tmpWaves.push({
                    count: dto_w.count,
                    spawn_moment: dto_w.spawn_moment,
                    enemy_id: curEnemy._id,
                } as SpawnScriptEnemy);
            }
        });

        return tmpWaves;
    }

    // 
    updateMapPoints(mapPoints: MapPoint[], udtoPoints: PointItemDto[]) {

        udtoPoints.forEach(udto_p => {
            const tmpPoint = mapPoints.find(p => p.index === udto_p.point_id);
            if (!tmpPoint) return;

            if (udto_p.position) {
                tmpPoint.position[0] = udto_p.position.x;
                tmpPoint.position[1] = udto_p.position.y;
                tmpPoint.position[2] = udto_p.position.z;
            }

            if (udto_p.type === ActivityPointTypes.none) {
                tmpPoint.spawn = null;
                tmpPoint.teleport = null;
            }
            else if (udto_p.type === ActivityPointTypes.spawn) {
                tmpPoint.spawn = {
                    is_enemy: udto_p?.spawn?.is_enemy,
                    is_player: udto_p?.spawn?.is_player,
                } as SpawnPoint;
                tmpPoint.teleport = null;
            }
            else if (udto_p.type === ActivityPointTypes.teleport) {
                tmpPoint.spawn = null;
                tmpPoint.teleport = {
                    next_index: udto_p?.teleport?.next_activity_id,
                    prev_index: udto_p?.teleport?.prev_activity_id,
                } as TeleportPoint;
            }

            // 
            tmpPoint.point_type = udto_p.type;
        });
    }
}