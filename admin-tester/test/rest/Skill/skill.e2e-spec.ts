import * as request from 'supertest';
// 
import '../../extends/ExtendedExpects';
import { TestsPipeline } from '../TestsPipeline';
import { Skill } from '../../../src/modules/Postgres/entity/Skill';

// 
describe('SkillController (e2e)', () => {
    const pipe = new TestsPipeline();

    // 
    beforeAll(() => pipe.beforeAll());
    afterAll(() => pipe.afterAll());

    // 
    const getItem = async () => {
        return await pipe.dataSource.getRepository(Skill).findOne({
            where: { id: 4 },
            relations: { requirement: true },
        });
    }

    // 
    it('/ POST: insert skill', async () => {
        await request(pipe.httpServer)
            .post('/skills')
            .send({
                "title": "new product",
                "parent_skill_id": 1,
                "requirement": {
                    "title": "ok",
                    "player_level": 1,
                    "strength": 1,
                    "endurance": 1,
                    "intelligence": 1,
                    "agility": 1,
                    "fire_weapons": 1,
                    "melee_weapons": 1,
                    "throwing": 1,
                    "doctor": 1,
                    "sneak": 1,
                    "steal": 1,
                    "traps": 1,
                    "science": 1,
                    "repair": 1,
                    "barter": 1
                }
            })
            .set('Accept', 'application/json')
            .expect(201)
            .expect({ "id": 4 });
    });

    it('check POST result', async () => {

        const resultObject = await getItem();

        expect(resultObject?.id).toBe(4);
        expect(resultObject?.title).toBe("new product");
        expect(resultObject?.parent_skill_id).toBe(1);

        expect(resultObject?.requirement.title).toBe("ok");
        expect(resultObject?.requirement.player_level).toBe(1);
        pipe.testProperties(resultObject?.requirement,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
    });

    it('/ GET: select skill', async () => {
        await request(pipe.httpServer)
            .get('/skills/4')
            .expect(200)
            .expect({
                "id": 4,
                "title": "new product",
                "parent_id": 1,
                "requirement": {
                    "title": "ok",
                    "player_level": 1,
                    "strength": 1,
                    "endurance": 1,
                    "intelligence": 1,
                    "agility": 1,
                    "fire_weapons": 1,
                    "melee_weapons": 1,
                    "throwing": 1,
                    "doctor": 1,
                    "sneak": 1,
                    "steal": 1,
                    "traps": 1,
                    "science": 1,
                    "repair": 1,
                    "barter": 1
                }
            });
    });

    it('/ PUT: update skill', async () => {
        await request(pipe.httpServer)
            .put('/skills/4')
            .send({
                "title": "IV",
                "parent_skill_id": 2,
                "requirement": {
                    "title": "ok",
                    "player_level": 5,
                    "strength": 5,
                    "endurance": 5,
                    "intelligence": 5,
                    "agility": 5,
                    "fire_weapons": 5,
                    "melee_weapons": 5,
                    "throwing": 5,
                    "doctor": 5,
                    "sneak": 5,
                    "steal": 5,
                    "traps": 5,
                    "science": 5,
                    "repair": 5,
                    "barter": 5
                }
            })
            .set('Accept', 'application/json')
            .expect(200)
            .expect({ "id": 4 });
    });

    it('check PUT-update result', async () => {

        const resultObject = await getItem();

        expect(resultObject?.id).toBe(4);
        expect(resultObject?.title).toBe("IV");
        expect(resultObject?.parent_skill_id).toBe(2);

        expect(resultObject?.requirement.player_level).toBe(5);
        pipe.testProperties(resultObject?.requirement,
            5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5);
    });

    it('/ GET: select list of skills', async () => {
        await request(pipe.httpServer)
            .get('/skills')
            .expect(200)
            .expect({
                "skills": [
                    { "id": 1, "title": "удар", "parent_id": null },
                    { "id": 2, "title": "удар в прыжке", "parent_id": 1 },
                    { "id": 3, "title": "удар в двойном прыжке", "parent_id": 2 },
                    { "id": 4, "title": "IV", "parent_id": 2 }
                ]
            });
    });

    it('/ DELETE: remove skill', async () => {
        await request(pipe.httpServer)
            .delete('/skills/4')
            .expect(200)
            .expect({ "rows": 1 });
    });

    it('/ GET: select list of skills after delete', async () => {
        await request(pipe.httpServer)
            .get('/skills')
            .expect(200)
            .expect({
                "skills": [
                    { "id": 1, "title": "удар", "parent_id": null },
                    { "id": 2, "title": "удар в прыжке", "parent_id": 1 },
                    { "id": 3, "title": "удар в двойном прыжке", "parent_id": 2 }
                ]
            });
    });

});
