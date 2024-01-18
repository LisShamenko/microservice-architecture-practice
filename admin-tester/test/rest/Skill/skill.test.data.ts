import '../../extends/ExtendedExpects';
import { InsertSkillDto } from '../../../src/rest/Skill/dto/InsertSkillDto';
import { RequirementDto } from '../../../src/rest/dto/RequirementDto';
import { UpdateSkillDto } from '../../../src/rest/Skill/dto/UpdateSkillDto';
import { Requirement } from '../../../src/modules/Postgres/entity/Requirement';
import { Skill } from '../../../src/modules/Postgres/entity/Skill';

/** insert */
export const test_1 = {
    in: {
        idto: {
            title: 'skill 0',
            parent_skill_id: 1,
            requirement: {
                title: 'requirement 0',
                player_level: 0,
                strength: 0,
            } as RequirementDto,
        } as InsertSkillDto,
    },
    mock: {
        in: {
            requirement: {
                id: 0,
                title: 'requirement 0',
                player_level: 0,
                strength: 0,
            },
            skill: {
                id: 0,
                title: 'skill 0',
                requirement_id: 0,
                parent_skill_id: 1,
            },
        },
        do: {
            save_skill_id: 0,
            save_requirement_id: 0,
        },
        out: {
            findOne_parent: { id: 1, title: 'parent 0' },

        },
    },
    out: {
        id: 0,
    },
}

/** update */
export const test_2 = {
    in: {
        skill_id: 0,
        udto: {
            title: 'new skill title',
            parent_skill_id: 2,
            requirement: {
                title: 'new requirement title',
                player_level: 5,
                strength: 5,
            } as RequirementDto,
        } as UpdateSkillDto,
    },
    mock: {
        in: {
            skill: {
                id: 0,
                title: 'new skill title',
                requirement_id: 0,
                parent_skill_id: 2,
            },
            requirement: {
                id: 0, title: 'new requirement title', player_level: 5,
                strength: 5, endurance: 0, intelligence: 0, agility: 0,
                fire_weapons: 0, melee_weapons: 0, throwing: 0, doctor: 0,
                sneak: 0, steal: 0, traps: 0, science: 0, repair: 0, barter: 0,
            },
        },
        do: {},
        out: {
            findOne_Skill: {
                id: 0,
                title: 'skill',
                parent_skill_id: 1,
                requirement_id: 0,
                requirement: {
                    id: 0, title: 'requirement', player_level: 0,
                    strength: 0, endurance: 0, intelligence: 0, agility: 0,
                    fire_weapons: 0, melee_weapons: 0, throwing: 0, doctor: 0,
                    sneak: 0, steal: 0, traps: 0, science: 0, repair: 0, barter: 0,
                },
            },
            findOne_parent: { id: 1, title: 'parent 0' },
        },
    },
    out: {
        id: 0,
    },
}

/** delete */
export const test_3 = {
    in: {
        skill_id: 0,
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
        skill_id: 0,
    },
    mock: {
        out: {
            findOne_Skill: {
                id: 0,
                title: 'skill',
                parent_skill_id: 1,
                requirement_id: 0,
                requirement: {
                    id: 0, title: 'requirement', player_level: 1,
                    strength: 1, endurance: 1, intelligence: 1, agility: 1,
                    fire_weapons: 1, melee_weapons: 1, throwing: 1, doctor: 1,
                    sneak: 1, steal: 1, traps: 1, science: 1, repair: 1, barter: 1,
                },
            },
        }
    },
    out: {
        id: 0,
        title: 'skill',
        parent_id: 1,
        requirement: {
            title: 'requirement', player_level: 1,
            strength: 1, endurance: 1, intelligence: 1, agility: 1,
            fire_weapons: 1, melee_weapons: 1, throwing: 1, doctor: 1,
            sneak: 1, steal: 1, traps: 1, science: 1, repair: 1, barter: 1,
        },
    },
}

/** getAll */
export const test_5 = {
    in: {},
    mock: {
        out: {
            find_Skill: [
                { id: 0, title: 'skill 0', parent_skill_id: 2 },
                { id: 1, title: 'skill 1', parent_skill_id: 1 },
                { id: 2, title: 'skill 2', parent_skill_id: 0 },
            ],
        },
    },
    out: {
        skills: [
            { id: 0, title: 'skill 0', parent_id: 2 },
            { id: 1, title: 'skill 1', parent_id: 1 },
            { id: 2, title: 'skill 2', parent_id: 0 },
        ],
    },
}

// 
let testIndex = 1;
export const nextTest = () => { testIndex += 1; }

// 
export const impls = {
    findImpl: async (options: any) => {
        if (testIndex === 5) return test_5.mock.out.find_Skill;
        return [];
    },
    findOneImpl: async (options: any) => {
        if (testIndex === 1) return test_1.mock.out.findOne_parent;
        if (testIndex === 2) {
            if (options?.where?.id === test_2.mock.out.findOne_Skill.id) {
                return test_2.mock.out.findOne_Skill;
            }
            if (options?.where?.id === test_2.mock.out.findOne_parent.id) {
                return test_2.mock.out.findOne_parent;
            }
        }
        if (testIndex === 4) return test_4.mock.out.findOne_Skill;
    },
    saveImpl: async (entity) => {
        if (testIndex === 1) {
            if (entity instanceof Requirement) {
                entity.id = test_1.mock.do.save_requirement_id;
            }
            else if (entity instanceof Skill) {
                entity.id = test_1.mock.do.save_skill_id;
                entity.requirement_id = test_1.mock.do.save_requirement_id;
            }
        }
    },
    deleteImpl: async () => {
        if (testIndex === 3) return test_3.mock.delete_result;
    },
    removeImpl: async (entity) => { },
}
