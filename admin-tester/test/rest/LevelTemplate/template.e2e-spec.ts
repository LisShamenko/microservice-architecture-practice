import * as request from 'supertest';
// 
import '../../extends/ExtendedExpects';
import { TestsPipeline } from '../TestsPipeline';
import { LevelTemplate } from '../../../src/modules/Postgres/entity/LevelTemplate';


// 
describe('TemplateController (e2e)', () => {
    const pipe = new TestsPipeline();

    // 
    beforeAll(() => pipe.beforeAll());
    afterAll(() => pipe.afterAll());

    // 
    const getItem = async () => {
        return await pipe.dataSource.getRepository(LevelTemplate).findOne({
            where: { id: 5 },
            relations: {
                playerProperty: true,
                inventory: {
                    products: {
                        product: true,
                    },
                },
                skills: true,
            },
        });
    }

    // 
    it('/ POST: insert template', async () => {
        await request(pipe.httpServer)
            .post('/templates')
            .send({
                "title": "test template",
                "properties": {
                    "strength": 17,
                    "endurance": 17,
                    "intelligence": 17,
                    "agility": 17,
                    "fire_weapons": 17,
                    "melee_weapons": 17,
                    "throwing": 17,
                    "doctor": 17,
                    "sneak": 17,
                    "steal": 17,
                    "traps": 17,
                    "science": 17,
                    "repair": 17,
                    "barter": 17
                },
                "products": [
                    { "product_id": 1, "count_in_slots": 5 }
                ],
                "skills": [1, 2]
            })
            .set('Accept', 'application/json')
            .expect(201)
            .expect({ "id": 5 });
    });

    it('check POST result', async () => {

        const resultObject = await getItem();

        expect(resultObject).toMatchObject({
            "id": 5,
            "title": "test template",
            "coins": 0,
        });

        expect(resultObject?.inventory.sorting).toBe("none");

        expect(resultObject?.inventory.products.length).toBe(1);
        pipe.testProduct(resultObject?.inventory.products[0], 5, "штаны пинателя", 1, 5, 5);

        pipe.testProperties(resultObject?.playerProperty,
            10, 10, 10, 10, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17);

        expect(resultObject?.skills).toContainObject({ level_template_id: 5, skill_id: 1 });
        expect(resultObject?.skills).toContainObject({ level_template_id: 5, skill_id: 2 });
    });

    it('/ GET: select template', async () => {
        await request(pipe.httpServer)
            .get('/templates/5')
            .expect(200)
            .expect({
                "id": 5,
                "title": "test template",
                "coins": 0,
                "properties": {
                    "strength": 10,
                    "endurance": 10,
                    "intelligence": 10,
                    "agility": 10,
                    "fire_weapons": 17,
                    "melee_weapons": 17,
                    "throwing": 17,
                    "doctor": 17,
                    "sneak": 17,
                    "steal": 17,
                    "traps": 17,
                    "science": 17,
                    "repair": 17,
                    "barter": 17
                },
                "inventory": {
                    "sorting": "none",
                    "products": [
                        {
                            "count_in_slot": 5,
                            "title": "штаны пинателя",
                            "price": 1,
                            "max_in_slot": 5,
                            "requirement_id": 5
                        }
                    ]
                },
                "skills": [
                    1,
                    2
                ]
            });
    });

    it('/ PUT: update template', async () => {
        await request(pipe.httpServer)
            .put('/templates/5')
            .send({
                "title": "test template II",
                "delta_properties": {
                    "strength": -7,
                    "endurance": -7,
                    "intelligence": -7,
                    "agility": -7,
                    "fire_weapons": 17,
                    "melee_weapons": 17,
                    "throwing": 17,
                    "doctor": 17,
                    "sneak": 17,
                    "steal": 17,
                    "traps": 17,
                    "science": 17,
                    "repair": 17,
                    "barter": 17
                },
                "products": {
                    "add": [{ "product_id": 2, "count_in_slots": 1 }],
                    "remove": [{ "product_id": 1, "count_in_slots": 4 }]
                },
                "skills": {
                    "add": [3],
                    "remove": [1]
                }
            })
            .set('Accept', 'application/json')
            .expect(200)
            .expect({ "id": 5 });
    });

    it('check PUT-update result', async () => {

        const resultObject = await getItem();

        expect(resultObject).toHaveProperty('title', "test template II");

        expect(resultObject?.inventory.products.length).toBe(2);
        pipe.testProduct(resultObject?.inventory.products[0], 1, "штаны пинателя", 1, 5, 5);
        pipe.testProduct(resultObject?.inventory.products[1], 1, "ракушки", 1, 50, 5);

        pipe.testProperties(resultObject?.playerProperty,
            3, 3, 3, 3, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34);

        expect(resultObject?.skills).toContainObject({ level_template_id: 5, skill_id: 2 });
        expect(resultObject?.skills).toContainObject({ level_template_id: 5, skill_id: 3 });
    });

    it('/ GET: select list of templates', async () => {
        await request(pipe.httpServer)
            .get('/templates')
            .expect(200)
            .expect({
                "templates": [
                    {
                        "id": 1,
                        "title": "юный боец на ногах"
                    },
                    {
                        "id": 2,
                        "title": "опытный боец на ногах"
                    },
                    {
                        "id": 3,
                        "title": "мастер боя на ногах"
                    },
                    {
                        "id": 4,
                        "title": "шаблон игрока"
                    },
                    {
                        "id": 5,
                        "title": "test template II"
                    }
                ]
            });
    });

    it('/ DELETE: remove template', async () => {
        await request(pipe.httpServer)
            .delete('/templates/5')
            .expect(200)
            .expect({ "rows": 1 });
    });

    it('/ GET: select list of templates after delete', async () => {
        await request(pipe.httpServer)
            .get('/templates')
            .expect(200)
            .expect({
                "templates": [
                    {
                        "id": 1,
                        "title": "юный боец на ногах"
                    },
                    {
                        "id": 2,
                        "title": "опытный боец на ногах"
                    },
                    {
                        "id": 3,
                        "title": "мастер боя на ногах"
                    },
                    {
                        "id": 4,
                        "title": "шаблон игрока"
                    }
                ]
            });
    });

});
