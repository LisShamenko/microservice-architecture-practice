import * as request from 'supertest';
// 
import '../../extends/ExtendedExpects';
import { TestsPipeline } from '../TestsPipeline';
import { SpawnScript } from '../../../src/modules/Postgres/entity/SpawnScript';

// 
describe('SpawnScriptController (e2e)', () => {
    const pipe = new TestsPipeline();

    // 
    beforeAll(() => pipe.beforeAll());
    afterAll(() => pipe.afterAll());

    // 
    const getItem = async () => {
        return await pipe.dataSource.getRepository(SpawnScript).findOne({
            where: { id: 2 },
            relations: { enemies: true },
        });
    }

    // 
    it('/ POST: insert spawn script', async () => {
        await request(pipe.httpServer)
            .post('/spawn-script')
            .send({
                "title": "new spawn",
                "waves": [
                    { "count": 1, "spawn_moment": 20, "enemy_id": 1 },
                    { "count": 3, "spawn_moment": 60, "enemy_id": 1 },
                    { "count": 1, "spawn_moment": 80, "enemy_id": 1 }
                ]
            })
            .set('Accept', 'application/json')
            .expect(201)
            .expect({ "id": 2 });
    });

    it('check POST result', async () => {
        const resultObject = await getItem();

        expect(resultObject?.id).toBe(2);
        expect(resultObject?.title).toBe("new spawn");

        expect(resultObject?.enemies.length).toBe(3);
        pipe.testSpawn(resultObject?.enemies[0], 5, 1, 20, 1);
        pipe.testSpawn(resultObject?.enemies[1], 6, 3, 60, 1);
        pipe.testSpawn(resultObject?.enemies[2], 7, 1, 80, 1);
    });

    it('/ GET: select spawn script', async () => {
        await request(pipe.httpServer)
            .get('/spawn-script/2')
            .expect(200)
            .expect({
                "id": 2,
                "title": "new spawn",
                "waves": [
                    { "id": 5, "count": 1, "spawn_moment": 20, "enemy_id": 1 },
                    { "id": 6, "count": 3, "spawn_moment": 60, "enemy_id": 1 },
                    { "id": 7, "count": 1, "spawn_moment": 80, "enemy_id": 1 }
                ]
            });
    });

    it('/ PUT: update spawn script', async () => {
        await request(pipe.httpServer)
            .put('/spawn-script/2')
            .send({
                "title": "spawn II",
                "waves": [
                    { "id": 6, "count": 2, "spawn_moment": 20, "enemy_id": 1 },
                    { "count": 1, "spawn_moment": 30, "enemy_id": 1 }
                ]
            })
            .set('Accept', 'application/json')
            .expect(200)
            .expect({ "id": 2 });
    });

    it('check PUT-update result', async () => {
        const resultObject = await getItem();

        expect(resultObject?.title).toBe("spawn II");

        expect(resultObject?.enemies.length).toBe(2);
        pipe.testSpawn(resultObject?.enemies[0], 6, 2, 20, 1);
        pipe.testSpawn(resultObject?.enemies[1], 8, 1, 30, 1);
    });

    it('/ GET: select list of spawn scripts', async () => {
        await request(pipe.httpServer)
            .get('/spawn-script')
            .expect(200)
            .expect({
                "spawn_scripts": [
                    { "id": 1, "title": "сценарий одной волны врагов" },
                    { "id": 2, "title": "spawn II" }
                ]
            });
    });

    it('/ DELETE: remove spawn script', async () => {
        await request(pipe.httpServer)
            .delete('/spawn-script/2')
            .expect(200)
            .expect({ "rows": 1 });
    });

    it('/ GET: select list of spawn scripts after delete', async () => {
        await request(pipe.httpServer)
            .get('/spawn-script')
            .expect(200)
            .expect({
                "spawn_scripts": [
                    { "id": 1, "title": "сценарий одной волны врагов" }
                ]
            });
    });

});
