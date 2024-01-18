import { Injectable } from "@nestjs/common";
// 
import { PointItemDto } from "../dto/PointItemDto";
import { ActivityPoint } from "../../modules/Postgres/entity/ActivityPoint";
import { ActivitySpawn } from "../../modules/Postgres/entity/ActivitySpawn";
import { ActivityTeleport } from "../../modules/Postgres/entity/ActivityTeleport";
import { MapPoint } from "../../modules/Postgres/entity/MapPoint";
import { Map } from "../../modules/Postgres/entity/Map";
import { ActivityPointTypes } from "../../modules/Postgres/enums/ActivityPointTypes";

// 
export interface IPointUpdates {
    removeSpawns: ActivitySpawn[];
    removeTeleports: ActivityTeleport[];
    updatePositions: MapPoint[];
    updatePoints: ActivityPoint[];
    updateSpawns: ActivitySpawn[];
    updateTeleports: ActivityTeleport[];
}

@Injectable()
export class MapHelper {
    constructor() { }

    getPointUpdates(map: Map, udto_points: PointItemDto[]): IPointUpdates {
        const removeSpawns: ActivitySpawn[] = [];
        const removeTeleports: ActivityTeleport[] = [];
        const updatePositions: MapPoint[] = [];
        const updatePoints: ActivityPoint[] = [];
        const updateSpawns: ActivitySpawn[] = [];
        const updateTeleports: ActivityTeleport[] = [];

        // 
        udto_points.forEach(udto_p => {
            const tmpPoint = map.points.find(p => p.id === udto_p.point_id);
            if (!tmpPoint) return;

            if (udto_p.position) {
                tmpPoint.position[0] = udto_p.position.x;
                tmpPoint.position[1] = udto_p.position.y;
                tmpPoint.position[2] = udto_p.position.z;
                updatePositions.push(tmpPoint);
            }

            let actPoint = tmpPoint.activityPoint;
            if (!actPoint) {
                actPoint = new ActivityPoint();
                actPoint.map_id = map.id;
                actPoint.pointType = ActivityPointTypes.none;
                actPoint.point_id = tmpPoint.id;
            }
            tmpPoint.activityPoint = actPoint;
            updatePoints.push(actPoint);

            if (udto_p.type === ActivityPointTypes.none) {
                if (actPoint.pointType === ActivityPointTypes.spawn) {
                    removeSpawns.push(actPoint.spawn);
                }
                else if (actPoint.pointType === ActivityPointTypes.teleport) {
                    removeTeleports.push(actPoint.teleport);
                }
            }
            else if (udto_p.type === ActivityPointTypes.spawn) {
                if (actPoint.pointType === ActivityPointTypes.teleport) {
                    actPoint.spawn = new ActivitySpawn();
                    actPoint.spawn.activity_id = actPoint.id;
                    removeTeleports.push(actPoint.teleport);
                }
                else if (actPoint.pointType === ActivityPointTypes.none) {
                    actPoint.spawn = new ActivitySpawn();
                    actPoint.spawn.activity_id = actPoint.id;
                }

                actPoint.spawn.is_enemy = udto_p.spawn.is_enemy;
                actPoint.spawn.is_player = udto_p.spawn.is_player;
                updateSpawns.push(actPoint.spawn);
            }
            else if (udto_p.type === ActivityPointTypes.teleport) {
                if (actPoint.pointType === ActivityPointTypes.spawn) {
                    actPoint.teleport = new ActivityTeleport();
                    actPoint.teleport.activity_id = actPoint.id;
                    removeSpawns.push(actPoint.spawn);
                }
                else if (actPoint.pointType === ActivityPointTypes.none) {
                    actPoint.teleport = new ActivityTeleport();
                    actPoint.teleport.activity_id = actPoint.id;
                }

                actPoint.teleport.next_activity_id = udto_p.teleport.next_activity_id;
                actPoint.teleport.prev_activity_id = udto_p.teleport.prev_activity_id;
                updateTeleports.push(actPoint.teleport);
            }
            actPoint.pointType = udto_p.type;
        });

        return {
            removeSpawns, removeTeleports, updatePositions,
            updatePoints, updateSpawns, updateTeleports,
        }
    }
}