import * as request from 'supertest';
// 
import '../../extends/ExtendedExpects';
import { TestsPipeline } from '../TestsPipeline';
import { Product } from '../../../src/modules/Postgres/entity/Product';
import { Requirement } from '../../../src/modules/Postgres/entity/Requirement';

// 
describe('ProductController (e2e)', () => {
    const pipe = new TestsPipeline();

    // 
    beforeAll(() => pipe.beforeAll());
    afterAll(() => pipe.afterAll());

    // 
    const getItem = async () => {
        return await pipe.dataSource.getRepository(Product).findOne({
            where: { id: 4 },
            relations: {
                requirement: true,
                skills: true,
            },
        });
    }

    // 
    it('/ POST: insert product', async () => {
        await request(pipe.httpServer)
            .post('/products')
            .send({
                "title": "new product",
                "price": 1000,
                "max_in_slot": 50,
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
                },
                "skills": [1],
                "type": "cloth",
            })
            .set('Accept', 'application/json')
            .expect(201)
            .expect({ "id": 4 });
    });

    it('check POST result', async () => {

        const resultObject = await getItem();

        expect(resultObject?.id).toBe(4);
        expect(resultObject?.title).toBe("new product");
        expect(resultObject?.price).toBe(1000);
        expect(resultObject?.max_in_slot).toBe(50);
        expect(resultObject?.product_type).toBe("cloth");

        expect(resultObject?.requirement.title).toBe("ok");
        expect(resultObject?.requirement.player_level).toBe(1);
        pipe.testProperties(resultObject?.requirement,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

        expect(resultObject?.skills).toContainObject({ product_id: 4, skill_id: 1 });
    });

    it('/ GET: select product', async () => {

        const result = await request(pipe.httpServer)
            .get('/products/4');

        expect(result.status).toEqual(200);
        expect(result.body).toMatchObject({
            "id": 4,
            "title": "new product",
            "price": 1000,
            "max_in_slot": 50,
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
            },
            "skills": [
                1
            ],
            "type": "cloth"
        });
    });

    it('/ PUT: update product', async () => {
        await request(pipe.httpServer)
            .put('/products/4')
            .send({
                "title": "new IV",
                "price": 10,
                "max_in_slot": 5,
                "requirement": {
                    "title": "ok",
                    "player_level": 10,
                    "strength": 10,
                    "endurance": 10,
                    "intelligence": 10,
                    "agility": 10,
                    "fire_weapons": 10,
                    "melee_weapons": 10,
                    "throwing": 10,
                    "doctor": 10,
                    "sneak": 10,
                    "steal": 10,
                    "traps": 10,
                    "science": 10,
                    "repair": 10,
                    "barter": 10
                },
                "skills": {
                    "add": [3],
                    "remove": [1]
                },
                "type": "weapon"
            })
            .set('Accept', 'application/json')
            .expect(200)
            .expect({ "id": 4 });
    });

    it('check PUT-update result', async () => {

        const resultObject = await getItem();

        expect(resultObject?.title).toBe("new IV");
        expect(resultObject?.price).toBe(10);
        expect(resultObject?.max_in_slot).toBe(5);
        expect(resultObject?.product_type).toBe("weapon");

        expect(resultObject?.requirement.player_level).toBe(10);
        pipe.testProperties(resultObject?.requirement,
            10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10);

        expect(resultObject?.skills).toContainObject({ product_id: 4, skill_id: 3 });
    });

    it('/ GET: select list of products', async () => {
        await request(pipe.httpServer)
            .get('/products')
            .expect(200)
            .expect({
                "products": [
                    { "id": 1, "title": "штаны пинателя" },
                    { "id": 2, "title": "ракушки" },
                    { "id": 3, "title": "меч" },
                    { "id": 4, "title": "new IV" }
                ]
            });
    });

    it('/ DELETE: remove product', async () => {
        await request(pipe.httpServer)
            .delete('/products/4')
            .expect(200)
            .expect({ "rows": 1 });
    });

    it('/ GET: select list of products after delete', async () => {
        await request(pipe.httpServer)
            .get('/products')
            .expect(200)
            .expect({
                "products": [
                    { "id": 1, "title": "штаны пинателя" },
                    { "id": 2, "title": "ракушки" },
                    { "id": 3, "title": "меч" },
                ]
            });
    });

});
