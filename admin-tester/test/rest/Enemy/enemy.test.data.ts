import '../../extends/ExtendedExpects';
import { InsertEnemyDto } from '../../../src/rest/Enemy/dto/InsertEnemyDto';
import { UpdateEnemyDto } from '../../../src/rest/Enemy/dto/UpdateEnemyDto';
import { InsertPropertiesDto } from '../../../src/rest/dto/InsertPropertiesDto';
import { FillProductsDto } from '../../../src/rest/dto/FillProductsDto';
import { FillSkillsDto } from '../../../src/rest/dto/FillSkillsDto';
import { InventoryProduct } from '../../../src/modules/Postgres/entity/InventoryProduct';
import { PlayerProperty } from '../../../src/modules/Postgres/entity/PlayerProperty';
import { Inventory } from '../../../src/modules/Postgres/entity/Inventory';
import { Sorting } from '../../../src/modules/Postgres/enums/Sorting';
import { ProductTypes } from '../../../src/modules/Postgres/enums/ProductTypes';
import { LevelTemplate } from '../../../src/modules/Postgres/entity/LevelTemplate';
import { Product } from '../../../src/modules/Postgres/entity/Product';
import { EnemyTypes } from '../../../src/modules/Postgres/enums/EnemyTypes';
import { EnemySkill } from '../../../src/modules/Postgres/entity/EnemySkill';
import { Enemy } from '../../../src/modules/Postgres/entity/Enemy';

// 
const getEnemyTemplate = () => ({
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
        { id: 0, enemy_id: 0, skill_id: 0 },
        { id: 1, enemy_id: 0, skill_id: 1 },
    ] as EnemySkill[],
});

const getResetEnemyTemplate = () => ({
    properties: {
        id: 1,
        strength: 3, endurance: 0, intelligence: 0, agility: 0,
        fire_weapons: 0, melee_weapons: 0, throwing: 0, doctor: 0,
        sneak: 0, steal: 0, traps: 0, science: 0, repair: 0, barter: 0,
    } as PlayerProperty,
    products: [
        { id: 15, count_in_all_slots: 5, inventory_id: 1, product_id: 1 },
        { id: 16, count_in_all_slots: 1, inventory_id: 1, product_id: 2 },
    ] as InventoryProduct[],
    skills: [
        { id: 0, enemy_id: 0, skill_id: 0 },
        { id: 1, enemy_id: 0, skill_id: 1 },
        { id: 4, enemy_id: 0, skill_id: 4 },
    ] as EnemySkill[],
});

const getOneEnemy = () => ({
    id: 4,
    enemy_type: EnemyTypes.Test,
    nickname: 'enemy 4',
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
        { id: 0, enemy_id: 4, skill_id: 1 } as EnemySkill,
        { id: 1, enemy_id: 4, skill_id: 2 } as EnemySkill,
    ] as EnemySkill[],
} as Enemy);

/** insert */
export const test_1 = {
    in: {
        idto: {
            nickname: 'enemy',
            level_template_id: 0,
            enemy_type: EnemyTypes.Test,
            delta_properties: { strength: 5 } as InsertPropertiesDto,
            products: {
                add: [{ product_id: 1, count_in_slots: 3 }],
                remove: [{ product_id: 0, count_in_slots: 5 }]
            } as FillProductsDto,
            skills: {
                add: [2],
                remove: [0],
            } as FillSkillsDto,
        } as InsertEnemyDto,
    },
    mock: {
        in: {
            properties: { strength: 10 },
            inventory: { id: 7, sorting: Sorting.none },
            products: [
                { count_in_all_slots: 0, inventory_id: 7, product_id: 0 },
                { count_in_all_slots: 3, inventory_id: 7, product_id: 1 },
            ],
            enemy: {
                nickname: 'enemy',
                inventory_id: 7,
                properties_id: 7,
                level_template_id: 0,
            },
            skills: [
                { enemy_id: 7, skill_id: 1 },
                { enemy_id: 7, skill_id: 2 },
            ],
        },
        do: {
            save_properties_id: 7,
            save_inventory_id: 7,
            save_enemy_id: 7,
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
            refillEnemySkills: {
                removeIndex: 0,
                addSkill: {
                    id: 2, enemy_id: 0, skill_id: 2,
                } as EnemySkill,
            },
        },
        out: {
            getEnemyTemplate: getEnemyTemplate(),
        },
    },
    out: {
        id: 7,
    },
}

/** update */
export const test_2 = {
    in: {
        enemy_id: 4,
        udto: {
            nickname: 'enemy',
            reset_template_id: 1,
            enemy_type: EnemyTypes.Test,
            delta_properties: { strength: 3 } as InsertPropertiesDto,
            products: {
                add: [{ product_id: 1, count_in_slots: 3 }],
                remove: [{ product_id: 0, count_in_slots: 5 }]
            } as FillProductsDto,
            skills: {
                add: [2],
                remove: [0],
            } as FillSkillsDto,
        } as UpdateEnemyDto,
    },
    mock: {
        in: {
            properties: { id: 1, strength: 10 },
            products: [
                { count_in_all_slots: 1, inventory_id: 7, product_id: 2 },
                { count_in_all_slots: 3, inventory_id: 7, product_id: 1 },
            ],
            skills: [
                { id: 1, enemy_id: 4, skill_id: 1 },
                { id: 4, enemy_id: 4, skill_id: 4 },
                { id: 3, enemy_id: 4, skill_id: 3 },
            ],
            enemy: {
                id: 4,
                nickname: 'enemy',
                enemy_type: EnemyTypes.Test,
                inventory_id: 7,
                properties_id: 7,
                level_template_id: 1,
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
            refillEnemySkills: {
                removeIndex: 0,
                addSkill: { id: 3, enemy_id: 0, skill_id: 3 } as EnemySkill,
            },
        },
        out: {
            findOne_Enemy: getOneEnemy(),
            getEnemyTemplate: getResetEnemyTemplate(),
        },
    },
    out: {
        id: 4,
    },
}

export const test_6 = {
    in: {
        enemy_id: 4,
        udto: {
            nickname: 'enemy',
            enemy_type: EnemyTypes.Test,
            delta_properties: { strength: 3 } as InsertPropertiesDto,
            products: {
                add: [{ product_id: 1, count_in_slots: 3 }],
                remove: [{ product_id: 0, count_in_slots: 5 }]
            } as FillProductsDto,
            skills: {
                add: [2],
                remove: [0],
            } as FillSkillsDto,
        } as UpdateEnemyDto,
    },
    mock: {
        in: {
            properties: { id: 7, strength: 8 },
            products: [
                { count_in_all_slots: 5, inventory_id: 7, product_id: 12 },
                { count_in_all_slots: 3, inventory_id: 7, product_id: 1 },
            ],
            skills: [
                { id: 1, enemy_id: 4, skill_id: 2 },
                { id: 3, enemy_id: 4, skill_id: 3 },
            ],
            enemy: {
                id: 4,
                nickname: 'enemy',
                enemy_type: EnemyTypes.Test,
                inventory_id: 7,
                properties_id: 7,
                level_template_id: 0,
            },
        },
        do: {
            setProperties: {
                strength: 8,
            },
            refillProducts: {
                countInSlots: 0,
                addProduct: {
                    id: 1, count_in_all_slots: 3, inventory_id: 0, product_id: 1
                } as InventoryProduct,
            },
            refillEnemySkills: {
                removeIndex: 0,
                addSkill: { id: 3, enemy_id: 0, skill_id: 3 } as EnemySkill,
            },
        },
        out: {
            findOne_Enemy: getOneEnemy(),
            filterSkills: [
                { id: 0, enemy_id: 4, skill_id: 1 } as EnemySkill,
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
        enemy_id: 0,
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
        enemy_id: 4,
    },
    mock: {
        out: {
            findOne_Enemy: getOneEnemy(),
        },
    },
    out: {
        id: 4,
        nickname: "enemy 4",
        enemy_type: EnemyTypes.Test,
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
    },
}

/** getAll */
export const test_5 = {
    in: {},
    mock: {
        out: [
            { id: 0, nickname: 'enemy 0' } as Enemy,
            { id: 1, nickname: 'enemy 1' } as Enemy,
        ] as Enemy[],
    },
    out: {
        enemies: [
            { id: 0, nickname: 'enemy 0' },
            { id: 1, nickname: 'enemy 1' },
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
        if (testIndex === 2) return test_2.mock.out.findOne_Enemy;
        if (testIndex === 4) return test_4.mock.out.findOne_Enemy;
        if (testIndex === 6) return test_6.mock.out.findOne_Enemy;
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
            else if (entity instanceof Enemy) {
                entity.id = test_1.mock.do.save_enemy_id;
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
        if (testIndex === 6) return test_6.mock.out.filterSkills;
        return [];
    },
    getEnemyTemplateImpl: () => {
        if (testIndex === 1) return test_1.mock.out.getEnemyTemplate;
        if (testIndex === 2) return test_2.mock.out.getEnemyTemplate;
    },
    setPropertiesImpl: (tmpProperties: PlayerProperty, delta: any) => {
        if (testIndex === 1) {
            tmpProperties.id = test_1.mock.do.setProperties.id;
            tmpProperties.strength = test_1.mock.do.setProperties.strength;
        }
        if (testIndex === 2) {
            tmpProperties.strength = test_2.mock.do.setProperties.strength;
        }
        if (testIndex === 6) {
            tmpProperties.strength = test_6.mock.do.setProperties.strength;
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
        if (testIndex === 6) {
            tmpProducts[0].count_in_all_slots = test_6.mock.do
                .refillProducts.countInSlots;
            tmpProducts.push(test_6.mock.do.refillProducts.addProduct);
        }
    },
    refillEnemySkillsImpl: (tmpSkills: EnemySkill[], skills: any) => {
        if (testIndex === 1) {
            tmpSkills.splice(test_1.mock.do.refillEnemySkills.removeIndex, 1);
            tmpSkills.push(test_1.mock.do.refillEnemySkills.addSkill);
        }
        if (testIndex === 2) {
            tmpSkills.splice(test_2.mock.do.refillEnemySkills.removeIndex, 1);
            tmpSkills.push(test_2.mock.do.refillEnemySkills.addSkill);
        }
        if (testIndex === 6) {
            tmpSkills.splice(test_6.mock.do.refillEnemySkills.removeIndex, 1);
            tmpSkills.push(test_6.mock.do.refillEnemySkills.addSkill);
        }
    },
}
