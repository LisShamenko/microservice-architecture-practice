import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//
import { InsertMapDto } from './dto/InsertMapDto';
import { UpdateMapDto } from './dto/UpdateMapDto';
import { Map, MapDocument, MapPoint } from './../../modules/Mongo/entity/Map';
import { MapHelper } from '../services/MapHelper';
import { ErrorHelper } from '../services/ErrorHelper';



//
@Injectable()
export class MapService {
    constructor(
        @InjectModel(Map.name, 'db')
        private mapModel: Model<MapDocument>,
        private mapHelper: MapHelper,
        private errorHelper: ErrorHelper,
    ) { }

    // 
    async insertMap(idto: InsertMapDto) {

        const map = new Map();
        map.scene_id = idto.scene_id;
        map.title = idto.title;

        if (idto.all_poins && idto.all_poins.length > 0) {
            map.map_points = idto.all_poins.map((p, i) => ({
                index: i,
                position: [p.x, p.y, p.z],
                point_type: 'none',
                spawn: null,
                teleport: null,
            } as MapPoint));
        }

        // 
        const newMap = new this.mapModel(map);
        const result = await newMap.save();
        return { id: result.id };
    }

    // 
    async updateMap(map_id: string, udto: UpdateMapDto) {

        const map = await this.mapModel
            .where({ _id: map_id })
            .findOne();
        this.errorHelper.foundError(map, 'map_id');

        // 
        this.mapHelper.updateMapPoints(map.map_points, udto.points);
        if (udto.title) map.title = udto.title;

        // 
        const result = await map.save();
        return { id: result.id };
    }

    // 
    async deleteMap(map_id: string) {
        try {
            const result = await this.mapModel
                .deleteOne({ _id: map_id });
            return { rows: result.deletedCount };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }

    // 
    async getOneMap(map_id: string) {

        const map = await this.mapModel
            .where({ _id: map_id })
            .findOne();
        this.errorHelper.foundError(map, 'map_id');

        return {
            id: map.id,
            title: map.title,
            points: map.map_points.map(p => ({
                id: p.index,
                position: p.position,
                type: p.point_type,
                spawn: {
                    is_player: p.spawn?.is_player,
                    is_enemy: p.spawn?.is_enemy,
                },
                teleport: {
                    next_index: p.teleport?.next_index,
                    prev_index: p.teleport?.prev_index,
                }
            })),
        };
    }

    // 
    async getAllMaps() {
        const maps = await this.mapModel
            .find();

        return {
            maps: (!maps) ? [] : maps.map(map => ({
                id: map.id,
                title: map.title,
            }))
        }
    }
}
