import * as request from 'supertest';
// 
import '../../extends/ExtendedExpects';
import { TestsPipeline } from '../TestsPipeline';
import { Player } from '../../../src/modules/Postgres/entity/Player';

// 
describe('PlayerController (e2e)', () => {
    const pipe = new TestsPipeline();

    // 
    beforeAll(() => pipe.beforeAll());
    afterAll(() => pipe.afterAll());

    // 
    const getItem = async () => {
        return await pipe.dataSource.getRepository(Player).findOne({
            where: { id: 3 },
            relations: {
                inventory: {
                    products: {
                        product: true,
                    },
                },
                playerProperty: true,
                levelTemplate: true,
                skills: true,
                effects: true,
            },
        });
    }

    // 
    it('/ POST: insert player', async () => {
        await request(pipe.httpServer)
            .post('/players')
            .send({
                "login": "second player",
                "password": "123",
                "firstname": "first",
                "secondname": "second",
                "thirdname": "third",
                "email": "123@mail",
                "level_template_id": 1,
                "delta_properties": {
                    "strength": 1
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
                },
                "effects": [{
                    "count_matches": 3,
                    "is_equipment": false,
                    "property_column": "strength",
                    "delta_value": "3"
                }]
            })
            .set('Accept', 'application/json')
            .expect(201)
            .expect({ "id": 3 });
    });

    it('check POST result', async () => {

        const resultObject = await getItem();

        expect(resultObject?.id).toBe(3);
        expect(resultObject?.login).toBe("second player");
        expect(resultObject?.inventory.sorting).toBe("none");
        expect(resultObject?.inventory.products.length).toBe(3);
        pipe.testProduct(resultObject?.inventory.products[0], 1, "штаны пинателя", 1, 5, 5);
        pipe.testProduct(resultObject?.inventory.products[1], 15, "ракушки", 1, 50, 5);
        pipe.testProduct(resultObject?.inventory.products[2], 1, "меч", 1, 1, 5);

        pipe.testProperties(resultObject?.playerProperty,
            6, 6, 4, 5, 14, 13, 14, 3, 13, 3, 6, 1, 3, 16);

        expect(resultObject?.levelTemplate.title).toBe("юный боец на ногах");
        expect(resultObject?.skills).toContainObject({ player_id: 3, skill_id: 3 });
        expect(resultObject?.effects.length).toBe(1);
        pipe.testEffect(resultObject?.effects[0], 2, 3, false, "strength", 3);
    });

    it('/ GET: select player', async () => {
        await request(pipe.httpServer)
            .get('/players/3')
            .expect(200)
            .expect({
                "id": 3,
                "login": "second player",
                "inventory": {
                    "sorting": "none",
                    "products": [
                        {
                            "count_in_slot": 1,
                            "title": "штаны пинателя",
                            "price": 1,
                            "max_in_slot": 5,
                            "requirement_id": 5,
                        },
                        {
                            "count_in_slot": 15,
                            "title": "ракушки",
                            "price": 1,
                            "max_in_slot": 50,
                            "requirement_id": 5,
                        },
                        {
                            "count_in_slot": 1,
                            "title": "меч",
                            "price": 1,
                            "max_in_slot": 1,
                            "requirement_id": 5,
                        }
                    ]
                },
                "properties": {
                    "strength": 6,
                    "endurance": 6,
                    "intelligence": 4,
                    "agility": 5,
                    "fire_weapons": 14,
                    "melee_weapons": 13,
                    "throwing": 14,
                    "doctor": 3,
                    "sneak": 13,
                    "steal": 3,
                    "traps": 6,
                    "science": 1,
                    "repair": 3,
                    "barter": 16,
                },
                "template": {
                    "title": "юный боец на ногах"
                },
                "skills": [
                    3
                ],
                "effects": [
                    {
                        "id": 2,
                        "count_matches": 3,
                        "is_equipment": false,
                        "property_column": "strength",
                        "delta_value": 3
                    }
                ]
            });
    });

    it('/ PUT: update player', async () => {
        await request(pipe.httpServer)
            .put('/players/3')
            .send({
                "firstname": "I",
                "secondname": "II",
                "thirdname": "III",
                "email": "IIIIII@mail",
                "delta_properties": {
                    "strength": 1
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
                },
                "effects": {
                    "add": [{
                        "count_matches": 1,
                        "is_equipment": false,
                        "property_column": "strength",
                        "delta_value": "1"
                    }],
                    "remove": [2]
                }
            })
            .set('Accept', 'application/json')
            .expect(200)
            .expect({ "id": 3 });
    });

    it('check PUT-update result', async () => {

        const resultObject = await getItem();

        expect(resultObject?.inventory.products.length).toBe(2);
        pipe.testProduct(resultObject?.inventory.products[0], 25, "ракушки", 1, 50, 5);
        pipe.testProduct(resultObject?.inventory.products[1], 1, "меч", 1, 1, 5);

        pipe.testProperties(resultObject?.playerProperty,
            7, 6, 4, 5, 14, 13, 14, 3, 13, 3, 6, 1, 3, 16);

        expect(resultObject?.effects.length).toBe(1);
        pipe.testEffect(resultObject?.effects[0], 3, 1, false, "strength", 1);
    });

    it('/ GET: select list of players', async () => {
        await request(pipe.httpServer)
            .get('/players')
            .expect(200)
            .expect({
                "players": [
                    { "id": 1, "login": "login" },
                    { "id": 2, "login": "log" },
                    { "id": 3, "login": "second player" }
                ]
            });
    });

    it('/ DELETE: remove player', async () => {
        await request(pipe.httpServer)
            .delete('/players/3')
            .expect(200)
            .expect({ "rows": 1 });
    });

    it('/ GET: select list of players after delete', async () => {
        await request(pipe.httpServer)
            .get('/players')
            .expect(200)
            .expect({
                "players": [
                    { "id": 1, "login": "login" },
                    { "id": 2, "login": "log" }
                ]
            });
    });

});
