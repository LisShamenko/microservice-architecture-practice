import * as request from 'supertest';
// 
import '../../extends/ExtendedExpects';
import { TestsPipeline } from '../TestsPipeline';
import { Map } from '../../../src/modules/Postgres/entity/Map';

// 
describe('MapController (e2e)', () => {
    const pipe = new TestsPipeline();

    // 
    beforeAll(() => pipe.beforeAll());
    afterAll(() => pipe.afterAll());

    // 
    const getItem = async () => {
        return await pipe.dataSource.getRepository(Map).findOne({
            where: { id: 2 },
            relations: {
                points: {
                    activityPoint: {
                        spawn: true,
                        teleport: true,
                    }
                }
            },
        });
    }

    // 
    it('/ POST: insert map', async () => {
        await request(pipe.httpServer)
            .post('/maps')
            .send({
                "scene_id": 1,
                "title": "new map",
                "all_poins": [
                    { "x": 0, "y": 0, "z": 1 },
                    { "x": 0, "y": 0, "z": 2 },
                    { "x": 0, "y": 0, "z": 3 }
                ]
            })
            .set('Accept', 'application/json')
            .expect(201)
            .expect({ "id": 2 });
    });

    it('check POST result', async () => {

        const resultObject = await getItem();

        expect(resultObject).toMatchObject({
            "id": 2,
            "title": "new map",
        });

        expect(resultObject?.points.length).toBe(3);

        const item0 = resultObject?.points[0];
        expect(item0?.id).toBe(10);
        expect(item0?.position).toEqual([0, 0, 1]);

        const item1 = resultObject?.points[1];
        expect(item1?.id).toBe(11);
        expect(item1?.position).toEqual([0, 0, 2]);

        const item2 = resultObject?.points[2];
        expect(item2?.id).toBe(12);
        expect(item2?.position).toEqual([0, 0, 3]);
    });

    it('/ GET: select map', async () => {
        await request(pipe.httpServer)
            .get('/maps/2')
            .expect(200)
            .expect({
                "id": 2,
                "title": "new map",
                "points": [
                    {
                        "id": 10,
                        "position": [
                            0,
                            0,
                            1
                        ],
                        "type": ""
                    },
                    {
                        "id": 11,
                        "position": [
                            0,
                            0,
                            2
                        ],
                        "type": ""
                    },
                    {
                        "id": 12,
                        "position": [
                            0,
                            0,
                            3
                        ],
                        "type": ""
                    }
                ]
            });
    });

    it('/ PUT: update map', async () => {
        await request(pipe.httpServer)
            .put('/maps/2')
            .send({
                "title": "new map",
                "points": [
                    {
                        "point_id": 10,
                        "position": {
                            "x": 1, "y": 1, "z": 0
                        },
                        "type": "spawn",
                        "spawn": {
                            "is_player": true,
                            "is_enemy": false
                        }
                    },
                    {
                        "point_id": 11,
                        "position": {
                            "x": 1, "y": 1, "z": 0
                        },
                        "type": "teleport",
                        "teleport": {
                            "next_activity_id": 1,
                            "prev_activity_id": 3
                        }
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(200)
            .expect({ "id": 2 });
    });

    it('check PUT-update result', async () => {

        const resultObject = await getItem();

        expect(resultObject).toMatchObject({
            "title": "new map",
        });

        expect(resultObject?.points.length).toBe(2);

        const item0 = resultObject?.points[0];
        expect(item0?.id).toBe(10);
        expect(item0?.position).toEqual([1, 1, 0]);
        expect(item0?.activityPoint.id).toBe(8);
        expect(item0?.activityPoint.pointType).toBe('spawn');
        expect(item0?.activityPoint?.spawn.is_player).toBe(true);
        expect(item0?.activityPoint?.spawn.is_enemy).toBe(false);

        const item1 = resultObject?.points[1];
        expect(item1?.id).toBe(11);
        expect(item1?.position).toEqual([1, 1, 0]);
        expect(item1?.activityPoint.id).toBe(9);
        expect(item1?.activityPoint.pointType).toBe('teleport');
        expect(item1?.activityPoint?.teleport.next_activity_id).toBe(1);
        expect(item1?.activityPoint?.teleport.prev_activity_id).toBe(3);
    });

    it('/ GET: select list of maps', async () => {
        await request(pipe.httpServer)
            .get('/maps')
            .expect(200)
            .expect({
                "maps": [
                    { "id": 1, "title": "первая карта" },
                    { "id": 2, "title": "new map" }
                ]
            });
    });

    it('/ DELETE: remove map', async () => {
        await request(pipe.httpServer)
            .delete('/maps/2')
            .expect(200)
            .expect({ "rows": 1 });
    });

    it('/ GET: select list of maps after delete', async () => {
        await request(pipe.httpServer)
            .get('/maps')
            .expect(200)
            .expect({
                "maps": [
                    { "id": 1, "title": "первая карта" }
                ]
            });
    });

});
