import '../../extends/ExtendedExpects';
import { InventoryProduct } from '../../../src/modules/Postgres/entity/InventoryProduct';
import { ProductTypes } from '../../../src/modules/Postgres/enums/ProductTypes';
import { Product } from '../../../src/modules/Postgres/entity/Product';
import { LevelEffectDto } from '../../../src/rest/dto/LevelEffectDto';
import { LevelEffect } from '../../../src/modules/Postgres/entity/LevelEffect';
import { PropertyColumns } from '../../../src/modules/Postgres/enums/PropertyColumns';
import { PlayerProperty } from '../../../src/modules/Postgres/entity/PlayerProperty';
import { InsertPropertiesDto } from '../../../src/rest/dto/InsertPropertiesDto';
import { ProductSkill } from '../../../src/modules/Postgres/entity/ProductSkill';
import { FillSkillsDto } from '../../../src/rest/dto/FillSkillsDto';
import { ActivityPoint } from '../../../src/modules/Postgres/entity/ActivityPoint';
import { ActivitySpawn } from '../../../src/modules/Postgres/entity/ActivitySpawn';
import { ActivityTeleport } from '../../../src/modules/Postgres/entity/ActivityTeleport';
import { MapPoint } from '../../../src/modules/Postgres/entity/MapPoint';
import { PointItemDto } from '../../../src/rest/dto/PointItemDto';
import { Map } from '../../../src/modules/Postgres/entity/Map';

/** ProductHelper: refillProducts */
export const test_productHelper_1 = {
    in: {
        getProducts: () => [
            { id: 0, count_in_all_slots: 10, inventory_id: 0, product_id: 0 },
            { id: 1, count_in_all_slots: 15, inventory_id: 0, product_id: 1 },
            { id: 2, count_in_all_slots: 20, inventory_id: 0, product_id: 2 },
        ] as InventoryProduct[],
        fillProducts: {
            add: [
                { product_id: 3, count_in_slots: 30 },
            ],
            remove: [
                { product_id: 0, count_in_slots: 5 },
                { product_id: 1, count_in_slots: 15 },
            ],
        },
    },
    mock: {
        find_Product: [
            { id: 0, max_in_slot: 25 },
            { id: 1, max_in_slot: 25 },
            { id: 2, max_in_slot: 25 },
            { id: 3, max_in_slot: 25 },
            { id: 4, max_in_slot: 25 },
        ],
    },
    out: [
        { id: 0, count_in_all_slots: 5, inventory_id: 0, product_id: 0 },
        { id: 1, count_in_all_slots: 0, inventory_id: 0, product_id: 1 },
        { id: 2, count_in_all_slots: 20, inventory_id: 0, product_id: 2 },
        { count_in_all_slots: 25, product_id: 3 },
    ],
}

/** ProductHelper: getTypeUpdates */
export const test_productHelper_2 = {
    none_id: 0,
    cloth_id: 1,
    shell_id: 2,
    weapon_id: 3,
    none: () => ({
        id: 0, product_type: ProductTypes.none
    } as Product),
    cloth: () => ({
        id: 1, product_type: ProductTypes.cloth, productCloth: { id: 0, product_id: 0 }
    } as Product),
    shell: () => ({
        id: 2, product_type: ProductTypes.shell, productShell: { id: 0, product_id: 0 }
    } as Product),
    weapon: () => ({
        id: 3, product_type: ProductTypes.weapon, productWeapon: { id: 0, product_id: 0 }
    } as Product),
    type_none: ProductTypes.none,
    type_cloth: ProductTypes.cloth,
    type_shell: ProductTypes.shell,
    type_weapon: ProductTypes.weapon,
    subProduct: { id: 0 },
}

/** LevelEffectsHelper */
export const test_levelEffectsHelper = {
    tmpEffects: () => [
        {
            id: 0,
            count_matches: 3,
            is_equipment: false,
            property_column: PropertyColumns.strength,
            delta_value: 3,
            player_id: 0,
        }
    ] as LevelEffect[],
    idtoEffects: [
        {
            count_matches: 1,
            is_equipment: false,
            property_column: PropertyColumns.strength,
            delta_value: -1,
        }
    ] as LevelEffectDto[],
    udtoEffects: [0],
}

//
export const test_MapHelper = {
    map: {
        id: 2,
        scene_id: 0,
        title: 'map 1',
        points: [
            // none -> none
            { id: 0, map_id: 2, position: [0, 0, 0] },
            // spawn -> none
            {
                id: 1, map_id: 2, position: [1, 1, 1],
                activityPoint: {
                    id: 1, pointType: 'spawn', map_id: 2, point_id: 1,
                    spawn: {
                        id: 0, is_player: true, is_enemy: false, activity_id: 1,
                    } as ActivitySpawn,
                } as ActivityPoint,
            },
            // teleport -> none
            {
                id: 2, map_id: 2, position: [2, 2, 2],
                activityPoint: {
                    id: 2, pointType: 'teleport', map_id: 2, point_id: 2,
                    teleport: {
                        id: 0, activity_id: 2,
                    } as ActivityTeleport,
                } as ActivityPoint,
            },
            // teleport -> spawn
            {
                id: 3, map_id: 2, position: [3, 3, 3],
                activityPoint: {
                    id: 3, pointType: 'teleport', map_id: 2, point_id: 3,
                    teleport: {
                        id: 1,
                        activity_id: 3,
                    } as ActivityTeleport,
                } as ActivityPoint,
            },
            // none -> spawn
            {
                id: 4, map_id: 2, position: [4, 4, 4],
                activityPoint: {
                    id: 4, pointType: 'none', map_id: 2, point_id: 4,
                } as ActivityPoint,
            },
            // spawn -> teleport
            {
                id: 5, map_id: 2, position: [5, 5, 5],
                activityPoint: {
                    id: 5, pointType: 'spawn', map_id: 2, point_id: 5,
                    spawn: {
                        id: 1, is_player: true, is_enemy: false, activity_id: 5,
                    } as ActivitySpawn,
                } as ActivityPoint,
            },
            // none -> teleport
            {
                id: 6, map_id: 2, position: [6, 6, 6],
                activityPoint: {
                    id: 6, pointType: 'none', map_id: 2, point_id: 6,
                } as ActivityPoint,
            },
        ] as MapPoint[],
    } as Map,
    udto_points: [
        // none -> none
        { point_id: 0, type: 'none', position: { x: 5, y: 5, z: 5 } },
        // spawn -> none
        { point_id: 1, type: 'none' },
        // teleport -> none
        { point_id: 2, type: 'none' },
        // teleport -> spawn
        {
            point_id: 3, type: 'spawn',
            spawn: { is_enemy: true, is_player: false },
        },
        // none -> spawn
        {
            point_id: 4, type: 'spawn',
            spawn: { is_enemy: false, is_player: true },
        },
        // spawn -> teleport
        {
            point_id: 5, type: 'teleport',
            teleport: { next_activity_id: 6, prev_activity_id: 6 },
        },
        // none -> teleport
        {
            point_id: 6, type: 'teleport',
            teleport: { next_activity_id: 5, prev_activity_id: 5 },
        },
    ] as PointItemDto[],
    out: {
        updatePositions: [
            { id: 0, map_id: 2, position: [5, 5, 5] }
        ],
        updatePoints: [
            { point_id: 0, pointType: 'none' },
            { point_id: 1, pointType: 'none' },
            { point_id: 2, pointType: 'none' },
            { point_id: 3, pointType: 'spawn' },
            { point_id: 4, pointType: 'spawn' },
            { point_id: 5, pointType: 'teleport' },
            { point_id: 6, pointType: 'teleport' },
        ],
        removeSpawns: [
            { id: 0, is_player: true, is_enemy: false, activity_id: 1 },
            { id: 1, is_player: true, is_enemy: false, activity_id: 5 },
        ],
        removeTeleports: [
            { id: 0, activity_id: 2 },
            { id: 1, activity_id: 3 },
        ],
        updateSpawns: [
            { activity_id: 3, is_enemy: true, is_player: false },
            { activity_id: 4, is_enemy: false, is_player: true },
        ],
        updateTeleports: [
            { activity_id: 5, next_activity_id: 6, prev_activity_id: 6 },
            { activity_id: 6, next_activity_id: 5, prev_activity_id: 5 },
        ],
    }
}

/** PropertyHelper: setProperties */
export const test_propertyHelper = {
    getProperties: () => ({
        id: 0,
        strength: 0, endurance: 0, intelligence: 0, agility: 0,
        fire_weapons: 0, melee_weapons: 0, throwing: 0, doctor: 0,
        sneak: 0, steal: 0, traps: 0, science: 0, repair: 0, barter: 0,
    } as PlayerProperty),
    delta: {
        strength: 50,
        endurance: -10,
        intelligence: 5,
        fire_weapons: 150,
        melee_weapons: -10,
        throwing: 50,
    } as InsertPropertiesDto,
    result: {
        strength: 10, endurance: 0, intelligence: 5,
        fire_weapons: 100, melee_weapons: 0, throwing: 50,
    },
}

/** ProductHelper: refillProducts */
export const test_skillHelper = {
    in: {
        getTmpSkills: () => [
            { id: 0, product_id: 0, skill_id: 0 },
            { id: 2, product_id: 0, skill_id: 2 },
        ] as ProductSkill[],
        fillSkills: {
            add: [1],
            remove: [2],
        } as FillSkillsDto,
    },
    mock: {
        find_Skill: [
            { id: 0, title: 'skill 0' },
            { id: 1, title: 'skill 1' },
            { id: 2, title: 'skill 2' },
        ],
    },
    out: {
        refillResult: [
            { id: 0, product_id: 0, skill_id: 0 },
            { skill_id: 1 },
        ],
        filterResult: {
            id: 2, product_id: 0, skill_id: 2
        },
    },
}

/** TemplateHelper: getPalyerTemplate */
export const test_templateHelper = {
    in: {
        level_template_id: 0,
    },
    mock: {
        findOne_LevelTemplate: {
            id: 0,
            title: 'level 0',
            coins: 100,
            properties_id: 0,
            inventory_id: 0,
            playerProperty: {
                id: 0,
                strength: 0, endurance: 0, intelligence: 0, agility: 0,
                fire_weapons: 0, melee_weapons: 0, throwing: 0, doctor: 0,
                sneak: 0, steal: 0, traps: 0, science: 0, repair: 0, barter: 0,
            },
            inventory: {
                products: [
                    { id: 0, count_in_all_slots: 10, inventory_id: 0, product_id: 0 },
                    { id: 1, count_in_all_slots: 5, inventory_id: 0, product_id: 1 },
                ],
            },
            skills: [
                { id: 0, level_template_id: 0, skill_id: 0 },
                { id: 1, level_template_id: 0, skill_id: 1 },
                { id: 2, level_template_id: 0, skill_id: 2 },
            ],
        },
    },
    out: {
        properties: {
            strength: 0, endurance: 0, intelligence: 0, agility: 0,
            fire_weapons: 0, melee_weapons: 0, throwing: 0, doctor: 0,
            sneak: 0, steal: 0, traps: 0, science: 0, repair: 0, barter: 0,
        },
        products: [
            { count_in_all_slots: 10, inventory_id: 0, product_id: 0 },
            { count_in_all_slots: 5, inventory_id: 0, product_id: 1 },
        ],
        skills: [{ skill_id: 0 }, { skill_id: 1 }, { skill_id: 2 }]
    },
}

// 
export enum TestServices {
    None = 'None',
    ErrorHelper = 'ErrorHelper',
    LevelEffectsHelper = 'LevelEffectsHelper',
    MapHelper = 'MapHelper',
    ProductHelper = 'ProductHelper',
    PropertyHelper = 'PropertyHelper',
    SkillHelper = 'SkillHelper',
    TemplateHelper = 'TemplateHelper',
}

let testIndex = 1;
export const nextTest = () => {
    testIndex += 1;
}

let testService: TestServices = TestServices.None;
export const setTestService = (service: TestServices) => {
    testService = service;
    testIndex = 1;
}

// 
export const impls = {
    findImpl: async (options: any) => {
        if (testService === TestServices.ProductHelper) {
            return test_productHelper_1.mock.find_Product;
        }
        if (testService === TestServices.SkillHelper) {
            return test_skillHelper.mock.find_Skill;
        }
        return [];
    },
    findOneImpl: async (options: any) => {
        if (testService === TestServices.TemplateHelper) {
            return test_templateHelper.mock.findOne_LevelTemplate;
        }
    },
    saveImpl: async (entity) => { },
    deleteImpl: async () => { },
    removeImpl: async (entity) => { },
}
