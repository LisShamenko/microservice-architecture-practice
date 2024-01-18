import '../../extends/ExtendedExpects';
import { InsertProductDto } from '../../../src/rest/Product/dto/InsertProductDto';
import { UpdateProductDto } from '../../../src/rest/Product/dto/UpdateProductDto';
import { RequirementDto } from '../../../src/rest/dto/RequirementDto';
import { ProductTypes } from '../../../src/modules/Postgres/enums/ProductTypes';
import { ProductSkill } from '../../../src/modules/Postgres/entity/ProductSkill';
import { Requirement } from '../../../src/modules/Postgres/entity/Requirement';
import { Product } from '../../../src/modules/Postgres/entity/Product';
import { FillSkillsDto } from '../../../src/rest/dto/FillSkillsDto';

/** insert */
export const test_1 = {
    in: {
        idto: {
            title: 'product',
            price: 100,
            max_in_slot: 10,
            type: ProductTypes.weapon,
            requirement: {
                title: 'requirement 0', player_level: 2, strength: 2,
            } as RequirementDto,
            skills: [0],
        } as InsertProductDto,
    },
    mock: {
        in: {
            save_Requirement: {
                title: 'requirement 0', player_level: 2, strength: 2,
            } as Requirement,
            save_Product: {
                title: 'product',
                price: 100,
                max_in_slot: 10,
                product_type: ProductTypes.weapon,
                requirement: { id: 0 },
            } as Product,
            save_ProductSkills: [
                { product_id: 0, skill_id: 0 } as ProductSkill,
            ],
        },
        do: {
            addProductSkills: [
                { skill_id: 0 } as ProductSkill,
            ],
            save_Requirement_id: 0,
            save_Product_id: 0,
        },
    },
    out: {
        id: 0,
    },
}

/** update */
export const test_2 = {
    in: {
        product_id: 0,
        udto: {
            title: 'new product title',
            price: 50,
            max_in_slot: 1,
            type: ProductTypes.cloth,
            requirement: {
                title: 'new requirement title',
                player_level: 5,
                strength: 5,
            } as RequirementDto,
            skills: {
                add: [3],
                remove: [0],
            } as FillSkillsDto,
        } as UpdateProductDto,
    },
    mock: {
        in: {
            save_Requirement: {
                id: 0, title: 'new requirement title', player_level: 5,
                strength: 5, endurance: 0, intelligence: 0, agility: 0,
                fire_weapons: 0, melee_weapons: 0, throwing: 0, doctor: 0,
                sneak: 0, steal: 0, traps: 0, science: 0, repair: 0, barter: 0,
            } as Requirement,
            save_ProductSkills: [
                { id: 1, product_id: 0, skill_id: 1 } as ProductSkill,
                { id: 3, product_id: 0, skill_id: 3 } as ProductSkill,
            ],
            save_Product: {
                id: 0,
                title: 'new product title',
                price: 50,
                max_in_slot: 1,
                product_type: ProductTypes.cloth,
            } as Product,
        },
        do: {
            addSkill: { id: 3, product_id: 0, skill_id: 3 } as ProductSkill,
        },
        out: {
            findOne_Product: {
                id: 0,
                title: 'product',
                price: 100,
                max_in_slot: 10,
                product_type: ProductTypes.weapon,
                requirement: {
                    id: 0, title: 'requirement', player_level: 0,
                    strength: 0, endurance: 0, intelligence: 0, agility: 0,
                    fire_weapons: 0, melee_weapons: 0, throwing: 0, doctor: 0,
                    sneak: 0, steal: 0, traps: 0, science: 0, repair: 0, barter: 0,
                } as Requirement,
                skills: [
                    { id: 0, product_id: 0, skill_id: 0 } as ProductSkill,
                    { id: 1, product_id: 0, skill_id: 1 } as ProductSkill,
                ],
            },
            filterSkills: [
                { id: 0, product_id: 0, skill_id: 0 } as ProductSkill,
            ],
            getTypeUpdates: 'ok',
        },
    },
    out: {
        id: 0,
    },
}

/** delete */
export const test_3 = {
    in: {
        product_id: 0,
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
        product_id: 0,
    },
    mock: {
        out: {
            findOne_Product: {
                id: 0,
                title: 'product',
                price: 100,
                max_in_slot: 10,
                product_type: ProductTypes.weapon,
                requirement: {
                    id: 0, title: 'requirement', player_level: 0,
                    strength: 0, endurance: 0, intelligence: 0, agility: 0,
                    fire_weapons: 0, melee_weapons: 0, throwing: 0, doctor: 0,
                    sneak: 0, steal: 0, traps: 0, science: 0, repair: 0, barter: 0,
                } as Requirement,
                skills: [
                    { id: 0, product_id: 0, skill_id: 0 } as ProductSkill,
                    { id: 1, product_id: 0, skill_id: 1 } as ProductSkill,
                ],
            },
        },
    },
    out: {
        id: 0,
        title: 'product',
        price: 100,
        max_in_slot: 10,
        type: ProductTypes.weapon,
        requirement: {
            id: 0, title: 'requirement', player_level: 0,
            strength: 0, endurance: 0, intelligence: 0, agility: 0,
            fire_weapons: 0, melee_weapons: 0, throwing: 0, doctor: 0,
            sneak: 0, steal: 0, traps: 0, science: 0, repair: 0, barter: 0,
        } as Requirement,
        skills: [0, 1],
    },
}

/** getAll */
export const test_5 = {
    in: {},
    mock: {
        out: [
            { id: 0, title: 'product 0', price: 100 } as Product,
            { id: 1, title: 'product 1', price: 100 } as Product,
        ]
    },
    out: {
        products: [
            { id: 0, title: 'product 0' },
            { id: 1, title: 'product 1' },
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
        if (testIndex === 2) return test_2.mock.out.findOne_Product;
        if (testIndex === 4) return test_4.mock.out.findOne_Product;
        return {};
    },
    saveImpl: async (entity) => {
        if (testIndex === 1) {
            if (entity instanceof Requirement) {
                entity.id = test_1.mock.do.save_Requirement_id;
            }
            else if (entity instanceof Product) {
                entity.id = test_1.mock.do.save_Product_id;
            }
            else if (entity instanceof Array<ProductSkill>) {
                entity.forEach((p, i) => { p.id = i });
            }
        }
    },
    deleteImpl: async () => {
        if (testIndex === 3) return test_3.mock.delete_result;
    },
    removeImpl: async (entity) => { },
    addProductSkillsImpl: (tmpSkills: ProductSkill[], idtoSkills: number[]) => {
        if (testIndex === 1) tmpSkills.push(...test_1.mock.do.addProductSkills);
    },
    filterSkillsImpl: () => {
        if (testIndex === 2) return test_2.mock.out.filterSkills;
        return [];
    },
    refillProductSkillsImpl: (tmpSkills: ProductSkill[], skills: any) => {
        if (testIndex === 2) {
            const ind = tmpSkills.findIndex(v => v.id === 0);
            tmpSkills.splice(ind, 1);
            tmpSkills.push(test_2.mock.do.addSkill);
        }
    },
    getTypeUpdatesImpl: () => {
        if (testIndex === 2) return test_2.mock.out.getTypeUpdates;
    }
}
