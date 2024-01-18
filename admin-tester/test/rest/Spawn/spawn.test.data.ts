import '../../extends/ExtendedExpects';
import { InsertSpawnDto } from '../../../src/rest/Spawn/dto/InsertSpawnDto';
import { SpawnWaveDto } from '../../../src/rest/dto/SpawnWaveDto';
import { UpdateSpawnDto } from '../../../src/rest/Spawn/dto/UpdateSpawnDto';
import { SpawnScript } from '../../../src/modules/Postgres/entity/SpawnScript';
import { SpawnScriptEnemy } from '../../../src/modules/Postgres/entity/SpawnScriptEnemy';

/** insert */
export const test_1 = {
    in: {
        idto: {
            title: 'wave 0',
            waves: [
                { count: 1, spawn_moment: 20, enemy_id: 0 } as SpawnWaveDto,
                { count: 1, spawn_moment: 40, enemy_id: 1 } as SpawnWaveDto,
            ],
        } as InsertSpawnDto,
    },
    mock: {
        in: {
            spawnScript: {
                title: 'wave 0',
            },
            addWaves: [
                { script_id: 0, count: 1, spawn_moment: 20, enemy_id: 0 } as SpawnWaveDto,
                { script_id: 0, count: 1, spawn_moment: 40, enemy_id: 1 } as SpawnWaveDto,
            ],
        },
        do: {
            save_spawnScript_id: 0,
        },
        out: {
            find_Enemy: [{ id: 0 }, { id: 1 }],
        },
    },
    out: {
        id: 0,
    },
}

/** update */
export const test_2 = {
    in: {
        spawn_id: 0,
        udto: {
            title: 'wave 1',
            waves: [
                // update
                { id: 1, count: 3, spawn_moment: 30, enemy_id: 0 } as SpawnWaveDto,
                // add
                { count: 1, spawn_moment: 50, enemy_id: 1 } as SpawnWaveDto,
            ],
        } as UpdateSpawnDto,
    },
    mock: {
        in: {
            spawnScript: {
                id: 0,
                title: 'wave 1',
            },
            addWaves: [
                // updated
                { id: 1, count: 3, spawn_moment: 30, enemy_id: 0 } as SpawnWaveDto,
                // added
                { id: 2, count: 1, spawn_moment: 50, enemy_id: 1 } as SpawnWaveDto,
            ],
        },
        do: {
            save_ids: [1, 2],
        },
        out: {
            find_Enemy: [{ id: 0 }, { id: 1 }],
            findOne_SpawnScript: {
                id: 0,
                title: 'spawn 0',
                enemies: [
                    // remove
                    { id: 0, count: 1, spawn_moment: 10, script_id: 0, enemy_id: 0 },
                    // update
                    { id: 1, count: 1, spawn_moment: 10, script_id: 0, enemy_id: 1 },
                ],
            },
        },
    },
    out: {
        id: 0,

    },
}

/** delete */
export const test_3 = {
    in: {
        spawn_id: 0,
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
        spawn_id: 0,
    },
    mock: {
        out: {
            findOne_SpawnScript: {
                id: 0,
                title: 'spawn',
                enemies: [
                    { id: 0, count: 1, spawn_moment: 10, script_id: 0, enemy_id: 0 },
                    { id: 1, count: 1, spawn_moment: 10, script_id: 0, enemy_id: 1 },
                ],
            },
        }
    },
    out: {
        id: 0,
        title: 'spawn',
        waves: [
            { id: 0, count: 1, spawn_moment: 10, enemy_id: 0 },
            { id: 1, count: 1, spawn_moment: 10, enemy_id: 1 },
        ],
    },
}

/** getAll */
export const test_5 = {
    in: {},
    mock: {
        out: {
            find_SpawnScript: [
                { id: 0, title: 'spawn 0' },
                { id: 1, title: 'spawn 1' },
                { id: 2, title: 'spawn 2' },
            ],
        }
    },
    out: {
        spawn_scripts: [
            { id: 0, title: 'spawn 0' },
            { id: 1, title: 'spawn 1' },
            { id: 2, title: 'spawn 2' },
        ],
    },
}

// 
let testIndex = 1;
export const nextTest = () => { testIndex += 1; }

// 
export const impls = {
    findImpl: async (options: any) => {
        if (testIndex === 1) return test_1.mock.out.find_Enemy;
        if (testIndex === 2) return test_2.mock.out.find_Enemy;
        if (testIndex === 5) return test_5.mock.out.find_SpawnScript;
        return [];
    },
    findOneImpl: async () => {
        if (testIndex === 2) return test_2.mock.out.findOne_SpawnScript;
        if (testIndex === 4) return test_4.mock.out.findOne_SpawnScript;
    },
    saveImpl: async (entity) => {
        if (testIndex === 1) {
            if (entity instanceof SpawnScript) {
                entity.id = test_1.mock.do.save_spawnScript_id;
            }
            else if (entity instanceof Array<SpawnScriptEnemy>) {
                entity.forEach((p, i) => { p.id = i });
            }
        }
        if (testIndex === 2) {
            if (entity instanceof Array<SpawnScriptEnemy>) {
                entity.forEach((p, i) => {
                    p.id = test_2.mock.do.save_ids[i];
                });
            }
        }
    },
    deleteImpl: async () => {
        if (testIndex === 3) return test_3.mock.delete_result;
    },
    removeImpl: async (entity) => { },
}
