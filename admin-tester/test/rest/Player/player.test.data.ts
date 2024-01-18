import '../../extends/ExtendedExpects';
import { InsertPlayerDto } from '../../../src/rest/Player/dto/InsertPlayerDto';
import { UpdatePlayerDto } from '../../../src/rest/Player/dto/UpdatePlayerDto';
import { InsertPropertiesDto } from '../../../src/rest/dto/InsertPropertiesDto';
import { FillProductsDto } from '../../../src/rest/dto/FillProductsDto';
import { FillSkillsDto } from '../../../src/rest/dto/FillSkillsDto';
import { LevelEffectDto } from '../../../src/rest/dto/LevelEffectDto';
import { PropertyColumns } from '../../../src/modules/Postgres/enums/PropertyColumns';
import { InventoryProduct } from '../../../src/modules/Postgres/entity/InventoryProduct';
import { PlayerProperty } from '../../../src/modules/Postgres/entity/PlayerProperty';
import { PlayerSkill } from '../../../src/modules/Postgres/entity/PlayerSkill';
import { LevelEffect } from '../../../src/modules/Postgres/entity/LevelEffect';
import { Inventory } from '../../../src/modules/Postgres/entity/Inventory';
import { Player } from '../../../src/modules/Postgres/entity/Player';
import { Sorting } from '../../../src/modules/Postgres/enums/Sorting';
import { ProductTypes } from '../../../src/modules/Postgres/enums/ProductTypes';
import { LevelTemplate } from '../../../src/modules/Postgres/entity/LevelTemplate';
import { Product } from '../../../src/modules/Postgres/entity/Product';

// 
const getPalyerTemplate = () => ({
    properties: {
        id: 0,
        strength: 5, endurance: 0, intelligence: 0, agility: 0,
        fire_weapons: 0, melee_weapons: 0, throwing: 0, doctor: 0,
        sneak: 0, steal: 0, traps: 0, science: 0, repair: 0, barter: 0,
    } as PlayerProperty,
    products: [
        { id: 0, count_in_all_slots: 5, inventory_id: 0, product_id: 0 },
    ] as InventoryProduct[],
    skills: [
        { id: 0, player_id: 0, skill_id: 0 },
        { id: 1, player_id: 0, skill_id: 1 },
    ] as PlayerSkill[],
});

const getOnePlayer = () => ({
    id: 4,
    login: "login",
    password: "password",
    firstname: "firstname",
    secondname: "secondname",
    thirdname: "thirdname",
    email: "email",
    inventory_id: 7,
    properties_id: 7,
    level_template_id: 0,
    playerProperty: {
        id: 7,
        strength: 5, endurance: 0, intelligence: 0, agility: 0,
        fire_weapons: 0, melee_weapons: 0, throwing: 0, doctor: 0,
        sneak: 0, steal: 0, traps: 0, science: 0, repair: 0, barter: 0,
    } as PlayerProperty,
    inventory: {
        id: 7,
        sorting: Sorting.shells_asc,
        products: [
            {
                id: 0, count_in_all_slots: 10, inventory_id: 7, product_id: 8,
                product: {
                    id: 8, title: 'product 8', price: 50,
                    max_in_slot: 100, product_type: ProductTypes.cloth,
                    requirement_id: 0,
                } as Product,
            } as InventoryProduct,
            {
                id: 1, count_in_all_slots: 5, inventory_id: 7, product_id: 12,
                product: {
                    id: 12, title: 'product 12', price: 10,
                    max_in_slot: 100, product_type: ProductTypes.shell,
                    requirement_id: 1,
                } as Product,
            } as InventoryProduct,
        ] as InventoryProduct[],
    } as Inventory,
    levelTemplate: {
        id: 0,
        title: 'юный боец',
    } as LevelTemplate,
    skills: [
        { id: 0, player_id: 4, skill_id: 1 } as PlayerSkill,
        { id: 1, player_id: 4, skill_id: 2 } as PlayerSkill,
    ] as PlayerSkill[],
    effects: [
        {
            id: 0,
            count_matches: 3,
            is_equipment: false,
            property_column: 1,
            delta_value: 3,
            player_id: 4,
        } as LevelEffect
    ] as LevelEffect[],
} as Player);

/** insert */
export const test_1 = {
    in: {
        idto: {
            login: 'login',
            password: 'password',
            firstname: 'firstname',
            secondname: 'secondname',
            thirdname: 'thirdname',
            email: 'email',
            level_template_id: 0,
            delta_properties: { strength: 5 } as InsertPropertiesDto,
            products: {
                add: [{ product_id: 1, count_in_slots: 3 }],
                remove: [{ product_id: 0, count_in_slots: 5 }]
            } as FillProductsDto,
            skills: { add: [2], remove: [0] } as FillSkillsDto,
            effects: [
                {
                    count_matches: 3,
                    is_equipment: false,
                    property_column: PropertyColumns.strength,
                    delta_value: 3,
                },
            ] as LevelEffectDto[],
        } as InsertPlayerDto,
    },
    mock: {
        in: {
            properties: { strength: 10 },
            inventory: { id: 7, sorting: Sorting.none },
            products: [
                { count_in_all_slots: 0, inventory_id: 7, product_id: 0 },
                { count_in_all_slots: 3, inventory_id: 7, product_id: 1 },
            ],
            player: {
                login: "login",
                password: "password",
                firstname: "firstname",
                secondname: "secondname",
                thirdname: "thirdname",
                email: "email",
                inventory_id: 7,
                properties_id: 7,
                level_template_id: 0,
            },
            skills: [
                { player_id: 7, skill_id: 1 },
                { player_id: 7, skill_id: 2 },
            ],
            effects: [
                {
                    count_matches: 3,
                    is_equipment: false,
                    property_column: 1,
                    delta_value: 3,
                    player_id: 7,
                }
            ],
        },
        do: {
            save_properties_id: 7,
            save_inventory_id: 7,
            save_player_id: 7,
            // 
            setProperties: {
                id: 7,
                strength: 10,
            },
            refillProducts: {
                countInSlots: 0,
                addProduct: {
                    id: 1, count_in_all_slots: 3, inventory_id: 0, product_id: 1
                } as InventoryProduct,
            },
            refillPlayerSkills: {
                removeIndex: 0,
                addSkill: {
                    id: 2, player_id: 0, skill_id: 2,
                } as PlayerSkill,
            },
            addEffect: {
                count_matches: 3,
                is_equipment: false,
                property_column: PropertyColumns.strength,
                delta_value: 3,
            } as LevelEffect,
        },
        out: {
            getPalyerTemplate: getPalyerTemplate(),
        },
    },
    out: {
        id: 7,
    },
}

/** update */
export const test_2 = {
    in: {
        player_id: 4,
        udto: {
            firstname: 'firstname',
            secondname: 'secondname',
            thirdname: 'thirdname',
            email: 'email',
            delta_properties: { strength: 5 } as InsertPropertiesDto,
            products: {
                add: [{ product_id: 1, count_in_slots: 3 }],
                remove: [{ product_id: 0, count_in_slots: 5 }]
            } as FillProductsDto,
            skills: { add: [3], remove: [1] } as FillSkillsDto,
            effects: {
                add: [{
                    count_matches: 1,
                    is_equipment: false,
                    property_column: PropertyColumns.strength,
                    delta_value: 1,
                }] as LevelEffectDto[],
                remove: [0],
            },
        } as UpdatePlayerDto,
    },
    mock: {
        in: {
            properties: { id: 7, strength: 10 },
            products: [
                { count_in_all_slots: 5, inventory_id: 7, product_id: 12 },
                { count_in_all_slots: 3, inventory_id: 7, product_id: 1 },
            ],
            skills: [
                { id: 1, player_id: 4, skill_id: 2 },
                { id: 3, player_id: 4, skill_id: 3 },
            ],
            effects: [
                {
                    count_matches: 1,
                    is_equipment: false,
                    property_column: 1,
                    delta_value: 1,
                    player_id: 4,
                }
            ],
            player: {
                id: 4,
                login: "login",
                password: "password",
                firstname: "firstname",
                secondname: "secondname",
                thirdname: "thirdname",
                email: "email",
                inventory_id: 7,
                properties_id: 7,
                level_template_id: 0,
            },
        },
        do: {
            setProperties: {
                strength: 10,
            },
            refillProducts: {
                countInSlots: 0,
                addProduct: {
                    id: 1, count_in_all_slots: 3, inventory_id: 0, product_id: 1
                } as InventoryProduct,
            },
            refillPlayerSkills: {
                removeIndex: 0,
                addSkill: { id: 3, player_id: 0, skill_id: 3 } as PlayerSkill,
            },
            addEffect: {
                count_matches: 1,
                is_equipment: false,
                property_column: PropertyColumns.strength,
                delta_value: 1,
            } as LevelEffect,
        },
        out: {
            findOne_Player: getOnePlayer(),
            filterSkills: [
                { id: 0, player_id: 4, skill_id: 1 } as PlayerSkill,
            ],
            getRemoveEffects: [
                {
                    id: 0,
                    count_matches: 3,
                    is_equipment: false,
                    property_column: 1,
                    delta_value: 3,
                    player_id: 4,
                } as LevelEffect,
            ],
        },
    },
    out: {
        id: 4,
    },
}

/** delete */
export const test_3 = {
    in: {
        player_id: 0,
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
        player_id: 4,
    },
    mock: {
        out: {
            findOne_Player: getOnePlayer(),
        },
    },
    out: {
        id: 4,
        login: "login",
        inventory: {
            sorting: Sorting.shells_asc,
            products: [
                {
                    count_in_slot: 10,
                    title: 'product 8',
                    price: 50,
                    max_in_slot: 100,
                    requirement_id: 0,
                },
                {
                    count_in_slot: 5,
                    title: 'product 12',
                    price: 10,
                    max_in_slot: 100,
                    requirement_id: 1,
                },
            ],
        },
        properties: {
            strength: 5, endurance: 0, intelligence: 0, agility: 0,
            fire_weapons: 0, melee_weapons: 0, throwing: 0, doctor: 0,
            sneak: 0, steal: 0, traps: 0, science: 0, repair: 0, barter: 0,
        },
        template: {
            title: 'юный боец',
        },
        skills: [1, 2],
        effects: [{
            id: 0,
            count_matches: 3,
            is_equipment: false,
            property_column: 1,
            delta_value: 3,
        }] as LevelEffect[],
    },
}

/** getAll */
export const test_5 = {
    in: {},
    mock: {
        out: [
            { id: 0, login: 'player 0' } as Player,
            { id: 1, login: 'player 1' } as Player,
        ] as Player[],
    },
    out: {
        players: [
            { id: 0, login: 'player 0' },
            { id: 1, login: 'player 1' },
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
    findOneImpl: async () => {
        if (testIndex === 2) return test_2.mock.out.findOne_Player;
        if (testIndex === 4) return test_4.mock.out.findOne_Player;
        return {};
    },
    saveImpl: async (entity) => {
        if (testIndex === 1) {
            if (entity instanceof PlayerProperty) {
                entity.id = test_1.mock.do.save_properties_id;
            }
            else if (entity instanceof Inventory) {
                entity.id = test_1.mock.do.save_inventory_id;
                entity.sorting = Sorting.none;
            }
            else if (entity instanceof Player) {
                entity.id = test_1.mock.do.save_player_id;
            }
            else if (entity instanceof Array<Object>) {
                entity.forEach((p, i) => { p.id = i });
            }
        }
    },
    deleteImpl: async () => {
        if (testIndex === 3) return test_3.mock.delete_result;
    },
    filterSkillsImpl: () => {
        if (testIndex === 2) return test_2.mock.out.filterSkills;
        return [];
    },
    // 
    getPalyerTemplateImpl: () => {
        if (testIndex === 1) return test_1.mock.out.getPalyerTemplate;
    },
    setPropertiesImpl: (tmpProperties: PlayerProperty, delta: any) => {
        if (testIndex === 1) {
            tmpProperties.id = test_1.mock.do.setProperties.id;
            tmpProperties.strength = test_1.mock.do.setProperties.strength;
        }
        if (testIndex === 2) {
            tmpProperties.strength = test_2.mock.do.setProperties.strength;
        }
    },
    refillProductsImpl: (tmpProducts: InventoryProduct[], products: any) => {
        if (testIndex === 1) {
            tmpProducts[0].count_in_all_slots = test_1.mock.do
                .refillProducts.countInSlots;
            tmpProducts.push(test_1.mock.do.refillProducts.addProduct);
        }
        if (testIndex === 2) {
            tmpProducts[0].count_in_all_slots = test_2.mock.do
                .refillProducts.countInSlots;
            tmpProducts.push(test_2.mock.do.refillProducts.addProduct);
        }
    },
    refillPlayerSkillsImpl: (tmpSkills: PlayerSkill[], skills: any) => {
        if (testIndex === 1) {
            tmpSkills.splice(test_1.mock.do.refillPlayerSkills.removeIndex, 1);
            tmpSkills.push(test_1.mock.do.refillPlayerSkills.addSkill);
        }
        if (testIndex === 2) {
            tmpSkills.splice(test_2.mock.do.refillPlayerSkills.removeIndex, 1);
            tmpSkills.push(test_2.mock.do.refillPlayerSkills.addSkill);
        }
    },
    addEffectsImpl: (tmpEffects: LevelEffect[], idtoEffects: any) => {
        if (testIndex === 1) tmpEffects.push(test_1.mock.do.addEffect);
        if (testIndex === 2) tmpEffects.push(test_2.mock.do.addEffect);
    },
    getRemoveEffectsImpl: (playerEffects: LevelEffect[], udtoEffects: any) => {
        if (testIndex === 2) return test_2.mock.out.getRemoveEffects;
        return [];
    },
}
