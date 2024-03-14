import { Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { PaginatorArgs } from 'nestjs-graphql-tools';
// 
import { Map } from './../../../modules/Postgres/entity/Map';
import { MapPoint } from './../../../modules/Postgres/entity/MapPoint';
import { ActivitySpawn } from './../../../modules/Postgres/entity/ActivitySpawn';
import { ActivityTeleport } from './../../../modules/Postgres/entity/ActivityTeleport';
import { MapHelper } from '../services/MapHelper';
import { ErrorHelper } from '../services/ErrorHelper';
import { NewMapInput, MapObject, UpdateMapInput } from './map.objects';



// 
@Injectable()
export class MapService {
    private repoMap: Repository<Map>;
    private repoMapPoint: Repository<MapPoint>;
    private repoActivitySpawn: Repository<ActivitySpawn>;
    private repoActivityTeleport: Repository<ActivityTeleport>;

    constructor(
        private sequelize: Sequelize,
        private mapHelper: MapHelper,
        private errorHelper: ErrorHelper,
    ) {
        this.repoMap = this.sequelize.getRepository(Map);
        this.repoMapPoint = this.sequelize.getRepository(MapPoint);
        this.repoActivitySpawn = this.sequelize.getRepository(ActivitySpawn);
        this.repoActivityTeleport = this.sequelize.getRepository(ActivityTeleport);
    }

    // 
    async createMap(idto: NewMapInput): Promise<Map> {
        return await Map.create({
            scene_id: idto.scene_id,
            title: idto.title,
            points: idto.poins && idto.poins.map(
                p => ({ position: [p.x, p.y, p.z] } as MapPoint)
            ),
        }, {
            include: ['points']
        });
    }

    async updateMap(udto: UpdateMapInput): Promise<Map> {

        const map = await this.repoMap.findOne({
            where: { id: udto.map_id },
            include: [{
                association: 'points', include: [{
                    association: 'activityPoint',
                    include: ['spawn', 'teleport'],
                }],
            }],
        });
        this.errorHelper.foundError(map, 'map_id');

        // 
        const removePositions = map.points.filter(p =>
            udto.points.findIndex(udto_p => p.id === udto_p.point_id) < 0
        ).map(p => p.id);

        const {
            removeSpawns, removeTeleports, updatePositions,
            updatePoints, updateSpawns, updateTeleports,
        } = this.mapHelper.getPointUpdates(map, udto.points);

        if (udto.title) map.title = udto.title;

        // 
        const t = await this.sequelize.transaction();
        try {

            await this.repoActivitySpawn.destroy(
                { where: { id: removeSpawns.map(p => p.id) }, transaction: t }
            );
            await this.repoActivityTeleport.destroy(
                { where: { id: removeTeleports.map(p => p.id) }, transaction: t }
            );

            for (const p of updatePoints) {
                await p.save({ transaction: t });
                if (p.spawn) p.spawn.activity_id = p.id;
                if (p.teleport) p.teleport.activity_id = p.id;
            }

            for (const p of updateSpawns) await p.save({ transaction: t });
            for (const p of updateTeleports) await p.save({ transaction: t });

            await this.repoMapPoint.destroy({
                where: { id: removePositions }, transaction: t
            });
            for (const p of updatePositions) await p.save({ transaction: t });

            await map.save({ transaction: t });

            await t.commit();
        }
        catch (err) {
            await t.rollback();
            this.errorHelper.transactionError(err.message);
        }
        return map;
    }

    async getOneMap(map_id: number): Promise<MapObject> {
        return await this.repoMap.findOne({ where: { id: map_id } });
    }

    async getAllMaps(paginator: PaginatorArgs): Promise<MapObject[]> {
        if (paginator) {
            return await this.repoMap.findAll({
                offset: paginator.page * paginator.per_page,
                limit: paginator.per_page,
            });
        }
        return await this.repoMap.findAll();
    }

    async removeMap(map_id: number) {
        try {
            const result = await this.repoMap.destroy({
                where: { id: map_id },
                force: true,
            });
            return { rows: result };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }
}
