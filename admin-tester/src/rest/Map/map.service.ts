import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
//
import { InsertMapDto } from './dto/InsertMapDto';
import { UpdateMapDto } from './dto/UpdateMapDto';
import { Map } from './../../modules/Postgres/entity/Map';
import { ActivityPoint } from '../../modules/Postgres/entity/ActivityPoint';
import { ActivityPointTypes } from '../../modules/Postgres/enums/ActivityPointTypes';
import { MapPoint } from '../../modules/Postgres/entity/MapPoint';
import { ActivitySpawn } from '../../modules/Postgres/entity/ActivitySpawn';
import { ActivityTeleport } from '../../modules/Postgres/entity/ActivityTeleport';
import { ErrorHelper } from '../services/ErrorHelper';

//
@Injectable()
export class MapService {
    constructor(
        @InjectDataSource('postgres_db') private dataSource: DataSource,
        private errorHelper: ErrorHelper,
    ) { }

    // 
    async insertMap(idto: InsertMapDto) {

        const map = new Map();
        map.scene_id = idto.scene_id;
        map.title = idto.title;

        if (idto.all_poins && idto.all_poins.length > 0) {
            map.points = idto.all_poins.map(p => {
                const mapPoint = new MapPoint();
                mapPoint.position = [p.x, p.y, p.z];
                return mapPoint;
            });
        }

        // 
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(map);
            map.points.forEach(p => { p.map_id = map.id });
            await queryRunner.manager.save(map.points);
            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.errorHelper.transactionError(err.message);
        }
        finally {
            await queryRunner.release();
        }
        return { id: map.id };
    }

    // 
    async updateMap(map_id: number, udto: UpdateMapDto) {

        const map = await this.dataSource.getRepository(Map).findOne({
            where: { id: map_id },
            relations: {
                points: {
                    activityPoint: {
                        spawn: true,
                        teleport: true,
                    }
                }
            },
        });
        this.errorHelper.foundError(map, 'map_id');

        // 
        const removeSpawns: ActivitySpawn[] = [];
        const removeTeleports: ActivityTeleport[] = [];
        const updatePositions: MapPoint[] = [];
        const updatePoints: ActivityPoint[] = [];
        const updateSpawns: ActivitySpawn[] = [];
        const updateTeleports: ActivityTeleport[] = [];

        // 
        const removePositions = map.points.filter(p =>
            udto.points.findIndex(udto_p => p.id === udto_p.point_id) < 0
        );

        // 
        udto.points.forEach(udto_p => {
            const tmpPoint = map.points.find(p => p.id === udto_p.point_id);
            if (!tmpPoint) return;

            if (tmpPoint.position) {
                tmpPoint.position[0] = udto_p.position.x;
                tmpPoint.position[1] = udto_p.position.y;
                tmpPoint.position[2] = udto_p.position.z;
                updatePositions.push(tmpPoint);
            }

            let actPoint = tmpPoint.activityPoint;
            if (!actPoint) {
                actPoint = new ActivityPoint();
                actPoint.map_id = map_id;
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
                actPoint.pointType = ActivityPointTypes.none;
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

        // 
        if (udto.title) map.title = udto.title;

        // 
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.remove(removeSpawns);
            await queryRunner.manager.remove(removeTeleports);

            await queryRunner.manager.save(updatePoints);
            updatePoints.forEach(p => {
                if (p.spawn) p.spawn.activity_id = p.id;
                if (p.teleport) p.teleport.activity_id = p.id;
            })
            await queryRunner.manager.save(updateSpawns);
            await queryRunner.manager.save(updateTeleports);

            await queryRunner.manager.remove(removePositions);
            await queryRunner.manager.save(updatePositions);

            await queryRunner.manager.save(map);

            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.errorHelper.transactionError(err.message);
        }
        finally {
            await queryRunner.release();
        }
        return { id: map.id };
    }

    // 
    async deleteMap(map_id: number) {
        try {
            const result = await this.dataSource.getRepository(Map)
                .delete({ id: map_id });
            return { rows: result.affected };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }

    // 
    async getOneMap(map_id: number) {
        const map = await this.dataSource.getRepository(Map)
            .findOne({
                where: {
                    id: map_id,
                },
                relations: {
                    points: {
                        activityPoint: {
                            spawn: true,
                            teleport: true,
                        }
                    }
                },
            });
        this.errorHelper.foundError(map, 'map_id');

        return {
            id: map.id,
            title: map.title,
            points: map.points.map(p => ({
                id: p.id,
                position: p.position,
                type: (p.activityPoint) ? p.activityPoint.pointType : '',
                ...this.getPointProps(p.activityPoint)
            })),
        };
    }

    private getPointProps(point: ActivityPoint) {
        if (!point) return {};

        if (point.pointType === ActivityPointTypes.spawn) {
            return {
                spawn: {
                    is_player: point.spawn.is_player,
                    is_enemy: point.spawn.is_enemy,
                    activity_id: point.spawn.activity_id,
                }
            }
        }

        if (point.pointType === ActivityPointTypes.teleport) {
            return {
                teleport: {
                    next_activity_id: point.teleport.next_activity_id,
                    prev_activity_id: point.teleport.prev_activity_id,
                    activity_id: point.teleport.activity_id,
                }
            }
        }

        return {};
    }

    // 
    async getAllMaps() {
        const maps = await this.dataSource.getRepository(Map).find();
        return {
            maps: (!maps) ? [] : maps.map(map => ({
                id: map.id,
                title: map.title,
            }))
        }
    }
}
