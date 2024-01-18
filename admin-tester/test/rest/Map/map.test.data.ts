import '../../extends/ExtendedExpects';
import { Map } from '../../../src/modules/Postgres/entity/Map';
import { MapPoint } from '../../../src/modules/Postgres/entity/MapPoint';
import { ActivityPoint } from '../../../src/modules/Postgres/entity/ActivityPoint';
import { ActivitySpawn } from '../../../src/modules/Postgres/entity/ActivitySpawn';
import { ActivityTeleport } from '../../../src/modules/Postgres/entity/ActivityTeleport';
import { Vector3Dto } from '../../../src/rest/dto/Vector3Dto';
import { InsertMapDto } from '../../../src/rest/Map/dto/InsertMapDto';
import { PointItemDto } from '../../../src/rest/dto/PointItemDto';
import { UpdateMapDto } from '../../../src/rest/Map/dto/UpdateMapDto';

// 
const getOneMap = () => ({
    id: 2,
    scene_id: 0,
    title: 'map scene',
    points: [
        { id: 0, map_id: 2, position: [0, 0, 0] } as MapPoint,
        {
            id: 1, map_id: 2, position: [1, 1, 1],
            activityPoint: {
                id: 1, pointType: 'spawn', map_id: 2, point_id: 1,
                spawn: {
                    id: 0,
                    is_player: true,
                    is_enemy: false,
                    activity_id: 1,
                } as ActivitySpawn,
            } as ActivityPoint,
        } as MapPoint,
        {
            id: 2, map_id: 2, position: [2, 2, 2],
            activityPoint: {
                id: 2, pointType: 'teleport', map_id: 2, point_id: 2,
                teleport: {
                    id: 0,
                    activity_id: 2,
                } as ActivityTeleport,
            } as ActivityPoint,
        } as MapPoint,
    ] as MapPoint[],
} as Map);

/** insert */
export const test_1 = {
    in: {
        idto: {
            scene_id: 0,
            title: 'map 0',
            all_poins: [
                { x: 0, y: 0, z: 0 },
                { x: 1, y: 1, z: 1 },
            ] as Vector3Dto[],
        } as InsertMapDto,
    },
    mock: {
        in: {
            map: { scene_id: 0, title: 'map 0' },
            mapPoints: [
                { map_id: 7, position: [0, 0, 0] },
                { map_id: 7, position: [1, 1, 1] },
            ] as MapPoint[],
        },
        do: {
            save_map_id: 7,
        },
    },
    out: {
        id: 7,
    },
}

/** update */
export const test_2 = {
    in: {
        map_id: 2,
        udto: {
            title: 'new map title',
            points: [
                { point_id: 1, type: 'none', position: { x: 2, y: 2, z: 2 } },
                { point_id: 2, type: 'none' },
            ] as PointItemDto[],
        } as UpdateMapDto,
    },
    mock: {
        in: {
            map: { id: 2, scene_id: 0, title: 'new map title' },
            removePositions: [
                { id: 0, map_id: 2, position: [0, 0, 0] },
            ],
        },
        in_out: {
            getPointUpdates: {
                removeSpawns: [
                    { id: 0, is_player: true, is_enemy: false, activity_id: 1 },
                ],
                removeTeleports: [
                    { id: 0, activity_id: 2 },
                ],
                updatePositions: [
                    { id: 0, map_id: 2, position: [2, 2, 2] }
                ],
                updatePoints: [
                    { point_id: 1, pointType: 'none' },
                    { point_id: 2, pointType: 'none' },
                ],
                updateSpawns: [],
                updateTeleports: [],
            },
        },
        do: {},
        out: {
            findOne_Map: getOneMap(),
        },
    },
    out: {
        id: 2,
    },
}

/** delete */
export const test_3 = {
    in: {
        map_id: 0,
        owner_player_id: 0,
    },
    mock: {
        delete_result: {
            affected: 1,
        }
    },
    out: {
        rows: 1,
    },
}

/** getOne */
export const test_4 = {
    in: {
        map_id: 4,
    },
    mock: {
        out: {
            findOne_Map: getOneMap(),
        },
    },
    out: {
        id: 2,
        title: 'map scene',
        points: [
            { id: 0, position: [0, 0, 0], type: '' },
            {
                id: 1, position: [1, 1, 1], type: 'spawn',
                spawn: {
                    is_player: true,
                    is_enemy: false,
                    activity_id: 1,
                }
            },
            {
                id: 2, position: [2, 2, 2], type: 'teleport',
                teleport: {
                    next_activity_id: undefined,
                    prev_activity_id: undefined,
                    activity_id: 2,
                }
            },
        ],
    },
}

/** getAll */
export const test_5 = {
    in: {},
    mock: {
        out: [
            { id: 0, scene_id: 0, title: 'map 1' } as Map,
            { id: 1, scene_id: 1, title: 'map 1' } as Map,
            { id: 2, scene_id: 2, title: 'map 2' } as Map,
        ] as Map[],
    },
    out: {
        maps: [
            { id: 0, title: 'map 1' },
            { id: 1, title: 'map 1' },
            { id: 2, title: 'map 2' },
        ]
    },
}

// 
let testIndex = 1;
export const nextTest = () => { testIndex += 1; }

// 
export const impls = {
    findImpl: async (options: any) => {
        if (testIndex === 5) return test_5.mock.out;
        return [];
    },
    findOneImpl: async (entity) => {
        if (testIndex === 2) return test_2.mock.out.findOne_Map;
        if (testIndex === 4) return test_4.mock.out.findOne_Map;
        return {};
    },
    saveImpl: async (entity) => {
        if (testIndex === 1) {
            if (entity instanceof Map) {
                entity.id = test_1.mock.do.save_map_id;
            }
        }
    },
    deleteImpl: async () => {
        if (testIndex === 3) return test_3.mock.delete_result;
    },
    getPointUpdatesImpl: () => {
        if (testIndex === 2) return test_2.mock.in_out.getPointUpdates;
    },
}
