import '../../extends/ExtendedExpects';
import { InsertTemplateDto } from '../../../src/rest/LevelTemplate/dto/InsertTemplateDto';
import { UpdateTemplateDto } from '../../../src/rest/LevelTemplate/dto/UpdateTemplateDto';
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
import { LevelTemplateSkill } from '../../../src/modules/Postgres/entity/LevelTemplateSkill';
import { ProductItemDto } from '../../../src/rest/dto/ProductItemDto';


// 
const getOneTemplate = () => ({
    id: 0,
    title: 'template 0',
    coins: 100,
    properties_id: 0,
    inventory_id: 0,
    playerProperty: {
        id: 0,
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
    skills: [
        { id: 0, level_template_id: 0, skill_id: 0 },
        { id: 1, level_template_id: 0, skill_id: 1 },
    ] as LevelTemplateSkill[],
} as LevelTemplate);

/** insert */
export const test_1 = {
    in: {
        idto: {
            title: 'template 0',
            properties: { strength: 5 } as InsertPropertiesDto,
            products: [
                { product_id: 0, count_in_slots: 10 } as ProductItemDto,
                { product_id: 1, count_in_slots: 2 } as ProductItemDto,
            ] as ProductItemDto[],
            skills: [1, 2],
        } as InsertTemplateDto,
    },
    mock: {
        in: {
            properties: { id: 7, strength: 10 },
            inventory: { id: 7, sorting: Sorting.none },
            products: [
                { count_in_all_slots: 10, inventory_id: 7, product_id: 0 },
                { count_in_all_slots: 2, inventory_id: 7, product_id: 1 },
            ],
            template: {
                title: 'template 0',
            },
            skills: [
                { level_template_id: 3, skill_id: 1 },
                { level_template_id: 3, skill_id: 2 },
            ],
        },
        do: {
            save_properties_id: 7,
            save_inventory_id: 7,
            save_template_id: 3,
            // 
            setProperties: {
                strength: 10,
            },
            addProducts: [
                { product_id: 0, count_in_all_slots: 10 } as InventoryProduct,
                { product_id: 1, count_in_all_slots: 2 } as InventoryProduct,
            ],
            addSkills: [
                { skill_id: 1, } as LevelTemplateSkill,
                { skill_id: 2, } as LevelTemplateSkill,
            ],
        },
    },
    out: {
        id: 3,
    },
}

/** update */
export const test_2 = {
    in: {
        template_id: 4,
        udto: {
            title: 'new template title',
            delta_properties: { strength: 5 } as InsertPropertiesDto,
            products: {
                add: [{ product_id: 1, count_in_slots: 10 }],
                remove: [{ product_id: 8, count_in_slots: 10 }],
            } as FillProductsDto,
            skills: {
                add: [3],
                remove: [1],
            } as FillSkillsDto,
        } as UpdateTemplateDto,
    },
    mock: {
        in: {
            properties: { id: 0, strength: 10 },
            products: [
                { count_in_all_slots: 5, inventory_id: 7, product_id: 12 },
                { count_in_all_slots: 10, inventory_id: 7, product_id: 1 },
            ],
            skills: [
                { id: 0, level_template_id: 0, skill_id: 0 } as LevelTemplateSkill,
                { id: 3, level_template_id: 0, skill_id: 3 } as LevelTemplateSkill,
            ],
            template: {
                id: 0,
                title: 'new template title',
                coins: 100,
                inventory_id: 0,
                properties_id: 0,
            },
        },
        do: {
            setProperties: {
                strength: 10,
            },
            refillProducts: {
                countInSlots: 0,
                addProduct: {
                    id: 1, count_in_all_slots: 10, inventory_id: 0, product_id: 1
                } as InventoryProduct,
            },
            refillLevelSkills: {
                removeIndex: 1,
                addSkill: { id: 3, level_template_id: 0, skill_id: 3 } as LevelTemplateSkill,
            },
        },
        out: {
            findOne_Template: getOneTemplate(),
            filterSkills: [
                { id: 0, level_template_id: 4, skill_id: 1 } as LevelTemplateSkill,
            ],
        },
    },
    out: {
        id: 0,
    },
}

/** delete */
export const test_3 = {
    in: {
        template_id: 0,
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
        template_id: 4,
    },
    mock: {
        out: {
            findOne_Template: getOneTemplate(),
        },
    },
    out: {
        id: 0,
        title: 'template 0',
        coins: 100,
        properties: {
            strength: 5, endurance: 0, intelligence: 0, agility: 0,
            fire_weapons: 0, melee_weapons: 0, throwing: 0, doctor: 0,
            sneak: 0, steal: 0, traps: 0, science: 0, repair: 0, barter: 0,
        },
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
                }
            ],
        },
        skills: [0, 1],
    },
}

/** getAll */
export const test_5 = {
    in: {},
    mock: {
        out: [
            { id: 0, title: 'template 0' } as LevelTemplate,
            { id: 1, title: 'template 1' } as LevelTemplate,
        ] as LevelTemplate[],
    },
    out: {
        templates: [
            { id: 0, title: 'template 0' },
            { id: 1, title: 'template 1' },
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
        if (testIndex === 2) return test_2.mock.out.findOne_Template;
        if (testIndex === 4) return test_4.mock.out.findOne_Template;
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
            else if (entity instanceof LevelTemplate) {
                entity.id = test_1.mock.do.save_template_id;
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
    setPropertiesImpl: (tmpProperties: PlayerProperty, delta: any) => {
        if (testIndex === 1) {
            tmpProperties.strength = test_1.mock.do.setProperties.strength;
        }
        if (testIndex === 2) {
            tmpProperties.strength = test_2.mock.do.setProperties.strength;
        }
    },
    refillProductsImpl: (tmpProducts: InventoryProduct[], products: any) => {
        if (testIndex === 2) {
            tmpProducts[0].count_in_all_slots = test_2.mock.do
                .refillProducts.countInSlots;
            tmpProducts.push(test_2.mock.do.refillProducts.addProduct);
        }
    },
    refillLevelSkillsImpl: (tmpSkills: LevelTemplateSkill[], skills: any) => {
        if (testIndex === 2) {
            tmpSkills.splice(test_2.mock.do.refillLevelSkills.removeIndex, 1);
            tmpSkills.push(test_2.mock.do.refillLevelSkills.addSkill);
        }
    },
    addProductsToListImpl: (tmpProducts: InventoryProduct[], idtoProducts: any) => {
        if (testIndex === 1) {
            tmpProducts.push(test_1.mock.do.addProducts[0]);
            tmpProducts.push(test_1.mock.do.addProducts[1]);
        }
    },
    addLevelSkillsImpl: (tmpSkills: LevelTemplateSkill[], idtoSkills: any) => {
        if (testIndex === 1) {
            tmpSkills.push(test_1.mock.do.addSkills[0]);
            tmpSkills.push(test_1.mock.do.addSkills[1]);
        }
    },
}
