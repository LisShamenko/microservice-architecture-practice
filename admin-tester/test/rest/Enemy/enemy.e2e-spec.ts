import * as request from 'supertest';
// 
import '../../extends/ExtendedExpects';
import { TestsPipeline } from '../TestsPipeline';
import { Enemy } from '../../../src/modules/Postgres/entity/Enemy';


// 
describe('EnemyController (e2e)', () => {
    const pipe = new TestsPipeline();

    // 
    beforeAll(() => pipe.beforeAll());
    afterAll(() => pipe.afterAll());

    // 
    const getItem = async () => {
        return await pipe.dataSource.getRepository(Enemy).findOne({
            where: { id: 2 },
            relations: {
                inventory: {
                    products: {
                        product: true,
                    },
                },
                playerProperty: true,
                levelTemplate: true,
                skills: true,
            },
        });
    }

    // 
    it('/ POST: insert enemy', async () => {
        await request(pipe.httpServer)
            .post('/enemies')
            .send({
                "nickname": "second enemy",
                "level_template_id": 1,
                "enemy_type": "test",
                "delta_properties": {
                    "strength": 3,
                    "intelligence": -2,
                    "throwing": 90
                },
                "products": {
                    "add": [
                        { "product_id": 2, "count_in_slots": 10 },
                        { "product_id": 3, "count_in_slots": 1 }
                    ],
                    "remove": [
                        { "product_id": 1, "count_in_slots": 1 }
                    ]
                },
                "skills": {
                    "add": [3],
                    "remove": [1]
                }
            })
            .set('Accept', 'application/json')
            .expect(201)
            .expect({ "id": 2 });
    });

    it('check POST result', async () => {

        const resultObject = await getItem();

        expect(resultObject).toMatchObject({
            "id": 2,
            "nickname": "second enemy",
            "enemy_type": "test",
        });

        expect(resultObject?.inventory.sorting).toBe("none");

        resultObject?.inventory.products.forEach(item => {
            expect(item).toHaveProperty('count_in_all_slots');
            expect(item?.product).toHaveProperty('title');
            expect(item?.product).toHaveProperty('price');
            expect(item?.product).toHaveProperty('max_in_slot');
            expect(item?.product).toHaveProperty('requirement_id');
        });

        expect(resultObject?.inventory.products.length).toBe(3);
        pipe.testProduct(resultObject?.inventory.products[0], 1, "штаны пинателя", 1, 5, 5);
        pipe.testProduct(resultObject?.inventory.products[1], 15, "ракушки", 1, 50, 5);
        pipe.testProduct(resultObject?.inventory.products[2], 1, "меч", 1, 1, 5);

        pipe.testProperties(resultObject?.playerProperty,
            8, 6, 2, 5, 14, 13, 100, 3, 13, 3, 6, 1, 3, 16);

        expect(resultObject?.levelTemplate.title).toBe("юный боец на ногах");
        expect(resultObject?.skills).toContainObject({ enemy_id: 2, skill_id: 3 });
    });

    it('/ GET: select enemy', async () => {
        await request(pipe.httpServer)
            .get('/enemies/2')
            .expect(200)
            .expect({
                "id": 2,
                "nickname": "second enemy",
                "enemy_type": "test",
                "inventory": {
                    "sorting": "none",
                    "products": [
                        {
                            "count_in_slot": 1,
                            "title": "штаны пинателя",
                            "price": 1,
                            "max_in_slot": 5,
                            "requirement_id": 5
                        },
                        {
                            "count_in_slot": 15,
                            "title": "ракушки",
                            "price": 1,
                            "max_in_slot": 50,
                            "requirement_id": 5
                        },
                        {
                            "count_in_slot": 1,
                            "title": "меч",
                            "price": 1,
                            "max_in_slot": 1,
                            "requirement_id": 5,
                        },
                    ]
                },
                "properties": {
                    "strength": 8,
                    "endurance": 6,
                    "intelligence": 2,
                    "agility": 5,
                    "fire_weapons": 14,
                    "melee_weapons": 13,
                    "throwing": 100,
                    "doctor": 3,
                    "sneak": 13,
                    "steal": 3,
                    "traps": 6,
                    "science": 1,
                    "repair": 3,
                    "barter": 16,
                },
                "template": {
                    "title": "юный боец на ногах",
                },
                "skills": [
                    3,
                ]
            });
    });

    it('/ PUT: replace enemy template', async () => {
        await request(pipe.httpServer)
            .put('/enemies/2')
            .send({
                "nickname": "HelloWorld!",
                "reset_template_id": 2,
                "delta_properties": {
                    "strength": 5
                },
                "products": {
                    "add": [
                        { "product_id": 1, "count_in_slots": 50 },
                        { "product_id": 2, "count_in_slots": -10 },
                        { "product_id": 3, "count_in_slots": -10 }
                    ],
                    "remove": [
                        { "product_id": 1, "count_in_slots": 100 }
                    ]
                },
                "skills": {
                    "add": [3],
                    "remove": [1, 2, 3]
                }
            })
            .set('Accept', 'application/json')
            .expect(200)
            .expect({ "id": 2 });
    });

    it('check PUT-replace result', async () => {

        const resultObject = await getItem();

        expect(resultObject?.nickname).toBe("HelloWorld!");
        expect(resultObject?.inventory.products).toEqual([]);

        pipe.testProperties(resultObject?.playerProperty,
            10, 7, 3, 6, 21, 49, 38, 6, 30, 4, 8, 4, 5, 49);

        expect(resultObject?.levelTemplate.title).toBe("опытный боец на ногах");
        expect(resultObject?.skills).toEqual([]);
    });

    it('/ PUT: update enemy', async () => {
        await request(pipe.httpServer)
            .put('/enemies/2')
            .send({
                "nickname": "HelloWorld!",
                "delta_properties": {
                    "strength": -5
                },
                "products": {
                    "add": [
                        { "product_id": 1, "count_in_slots": 50 }
                    ]
                },
                "skills": {
                    "add": [3]
                }
            })
            .set('Accept', 'application/json')
            .expect(200)
            .expect({ "id": 2 });
    });

    it('check PUT-update result', async () => {

        const resultObject = await getItem();

        expect(resultObject?.inventory.products.length).toBe(1);
        pipe.testProduct(resultObject?.inventory.products[0], 5, "штаны пинателя", 1, 5, 5);

        pipe.testProperties(resultObject?.playerProperty,
            5, 7, 3, 6, 21, 49, 38, 6, 30, 4, 8, 4, 5, 49);

        expect(resultObject?.levelTemplate.title).toBe("опытный боец на ногах");
        expect(resultObject?.skills).toContainObject({ enemy_id: 2, skill_id: 3 });
    });

    it('/ GET: select list of enemies', async () => {
        await request(pipe.httpServer)
            .get('/enemies')
            .expect(200)
            .expect({
                "enemies": [
                    { "id": 1, "nickname": "first enemy" },
                    { "id": 2, "nickname": "HelloWorld!" }
                ]
            });
    });

    it('/ DELETE: remove enemy', async () => {
        await request(pipe.httpServer)
            .delete('/enemies/2')
            .expect(200)
            .expect({ "rows": 1 });
    });

    it('/ GET: select list of enemies after delete', async () => {
        await request(pipe.httpServer)
            .get('/enemies')
            .expect(200)
            .expect({
                "enemies": [
                    { "id": 1, "nickname": "first enemy" },
                ]
            });
    });

});
