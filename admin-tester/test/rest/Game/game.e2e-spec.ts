import * as request from 'supertest';
// 
import '../../extends/ExtendedExpects';
import { TestsPipeline } from '../TestsPipeline';
import { Game } from '../../../src/modules/Postgres/entity/Game';

// 
describe('GameController (e2e)', () => {
    const pipe = new TestsPipeline();

    // 
    beforeAll(() => pipe.beforeAll());
    afterAll(() => pipe.afterAll());

    // 
    const getItem = async () => {
        return await pipe.dataSource.getRepository(Game).findOne({
            where: { id: 1, players: true },
            relations: {
                players: {
                    player: true,
                }
            }
        });
    }

    // 
    it('/ POST: insert game', async () => {
        await request(pipe.httpServer)
            .post('/games')
            .send({
                "map_id": 1,
                "spawn_script_id": 1,
                "owner_player_id": 1,
            })
            .set('Accept', 'application/json')
            .expect(201)
            .expect({ "id": 1 });
    });

    it('check POST result', async () => {

        const resultObject = await getItem();

        expect(resultObject).toMatchObject({
            "id": 1,
            "map_id": 1,
            "spawn_script_id": 1,
        });

        expect(resultObject?.players.length).toBe(1);

        resultObject?.players.forEach(item => {
            expect(item.player).toHaveProperty('id');
            expect(item.player).toHaveProperty('login');
        });

        const item0 = resultObject?.players[0];
        expect(item0?.player).toHaveProperty('id', 1);
        expect(item0?.player).toHaveProperty('login', 'login');
    });

    it('/ GET: select game', async () => {
        await request(pipe.httpServer)
            .get('/games/1')
            .expect(200)
            .expect({
                "id": 1,
                "map_id": 1,
                "spawn_script_id": 1,
                "players": [
                    {
                        "id": 1,
                        "login": "login"
                    }
                ],
            });
    });

    it('/ PUT: update game', async () => {
        await request(pipe.httpServer)
            .put('/games/1')
            .send({
                "player_id": 2,
                "to_connect": true
            })
            .set('Accept', 'application/json')
            .expect(200)
            .expect({
                "insert_player": [
                    {
                        "id": 2
                    }
                ]
            });
    });

    it('check PUT-replace result', async () => {

        const resultObject = await getItem();

        expect(resultObject?.players.length).toBe(2);

        const item0 = resultObject?.players[0];
        expect(item0?.player).toHaveProperty('id', 1);
        expect(item0?.player).toHaveProperty('login', 'login');

        const item1 = resultObject?.players[1];
        expect(item1?.player).toHaveProperty('id', 2);
        expect(item1?.player).toHaveProperty('login', 'log');
    });

    it('/ GET: select list of games', async () => {
        await request(pipe.httpServer)
            .get('/games')
            .expect(200)
            .expect({
                "games": [
                    {
                        "id": 1,
                        "map_title": "первая карта",
                        "players_count": 2,
                        "enemies_count": 12
                    }
                ]
            });
    });

    it('/ DELETE: remove game', async () => {
        await request(pipe.httpServer)
            .delete('/games/1?owner=1')
            .expect(200)
            .expect({ "rows": 1 });
    });

    it('/ GET: select list of games after delete', async () => {
        await request(pipe.httpServer)
            .get('/games')
            .expect(200)
            .expect({ "games": [] });
    });

});
