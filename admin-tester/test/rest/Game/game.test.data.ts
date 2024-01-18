import '../../extends/ExtendedExpects';
import { InsertGameDto } from '../../../src/rest/Game/dto/InsertGameDto';
import { UpdateGameDto } from '../../../src/rest/Game/dto/UpdateGameDto';
import { Game } from '../../../src/modules/Postgres/entity/Game';
import { GamePlayer } from '../../../src/modules/Postgres/entity/GamePlayer';
import { SpawnScript } from '../../../src/modules/Postgres/entity/SpawnScript';
import { Map } from '../../../src/modules/Postgres/entity/Map';
import { SpawnScriptEnemy } from '../../../src/modules/Postgres/entity/SpawnScriptEnemy';

// 
const getOneGame = () => ({
    id: 4,
    map_id: 0,
    spawn_script_id: 0,
    owner_player_id: 0,
    players: [
        {
            id: 5, game_id: 4, player_id: 0,
            player: { id: 0, login: 'first' },
        } as GamePlayer,
        {
            id: 6, game_id: 4, player_id: 7,
            player: { id: 7, login: 'seven' },
        } as GamePlayer,
    ] as GamePlayer[],
    map: {
        title: 'current map',
    } as Map,
    spawnScript: {
        id: 20,
        enemies: [{
            id: 0,
            count: 3,
            spawn_moment: 50,
            script_id: 20,
            enemy_id: 6,
        }] as SpawnScriptEnemy[],
    } as SpawnScript,
} as Game);

/** insert */
export const test_1 = {
    in: {
        idto: {
            map_id: 1,
            spawn_script_id: 2,
            owner_player_id: 3,
        } as InsertGameDto,
    },
    mock: {
        in: {
            game: {
                map_id: 1,
                spawn_script_id: 2,
                owner_player_id: 3,
            },
            gamePlayer: {
                player_id: 3,
                game_id: 7,
            },
        },
        do: {
            save_game_id: 7,
        },
        out: {
            findOne_Map: { id: 1 },
            findOne_SpawnScript: { id: 2 },
            findOne_Player: { id: 3 },
        },
    },
    out: {
        id: 7,
    },
    incs: {
        findOne: 0,
    },
}

/** update */
export const test_2 = {
    in: {
        game_id: 4,
        udto_1: { player_id: 6, to_connect: true } as UpdateGameDto,
        udto_2: { player_id: 6, to_connect: false } as UpdateGameDto,
    },
    mock: {
        in: {
            insert_or_delete: { game_id: 4, player_id: 6 },
        },
        do: {},
        out: {
            findOne_Game_1: {
                id: 1, owner_player_id: 5,
                players: [
                    { id: 0, game_id: 1, player_id: 5 } as GamePlayer,
                ] as GamePlayer[],
            } as Game,
            findOne_Game_2: {
                id: 1, owner_player_id: 5,
                players: [
                    { id: 0, game_id: 1, player_id: 5 } as GamePlayer,
                    { id: 1, game_id: 1, player_id: 6 } as GamePlayer,
                ] as GamePlayer[],
            } as Game,
            findOne_Player_1: null,
            findOne_Player_2: { id: 0 },
            insert_GamePlayer: { identifiers: [6] },
            delete_GamePlayer: { affected: 6 },
        },
    },
    out: {
        result_1: {
            insert_player: 6,
        },
        result_2: {
            delete_player: 6,
        }
    },
    incs: {
        findOne: 0,
    },
}

/** delete */
export const test_3 = {
    in: {
        game_id: 0,
        owner_player_id: 0,
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
        game_id: 4,
    },
    mock: {
        out: {
            findOne_Game: getOneGame(),
        },
    },
    out: {
        id: 4,
        map_id: 0,
        spawn_script_id: 0,
        players: [
            { id: 0, login: 'first' },
            { id: 7, login: 'seven' },
        ],
    },
}

/** getAll */
export const test_5 = {
    in: {},
    mock: {
        out: [getOneGame()] as Game[],
    },
    out: {
        games: [{
            id: 4,
            map_title: 'current map',
            players_count: 2,
            enemies_count: 3,
        }]
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
    findOneImpl: async (entity) => {

        if (testIndex === 1) {
            if (test_1.incs.findOne === 0)
                return test_1.mock.out.findOne_Map;
            else if (test_1.incs.findOne === 1)
                return test_1.mock.out.findOne_SpawnScript;
            else if (test_1.incs.findOne === 2)
                return test_1.mock.out.findOne_Player;

            test_1.incs.findOne += 1;
            if (test_1.incs.findOne >= 3) test_1.incs.findOne = 0;
        }

        if (testIndex === 2) {
            if (test_2.incs.findOne === 0)
                return test_2.mock.out.findOne_Game_1;
            else if (test_2.incs.findOne === 1)
                return test_2.mock.out.findOne_Player_1;

            test_2.incs.findOne += 1;
            if (test_2.incs.findOne >= 2) test_2.incs.findOne = 0;
        }

        if (testIndex === 4) return test_4.mock.out.findOne_Game;

        if (testIndex === 6) {
            if (test_2.incs.findOne === 0)
                return test_2.mock.out.findOne_Game_2;
            else if (test_2.incs.findOne === 1)
                return test_2.mock.out.findOne_Player_2;

            test_2.incs.findOne += 1;
            if (test_2.incs.findOne >= 2) test_2.incs.findOne = 0;
        }
        
        return {};
    },
    saveImpl: async (entity) => {
        if (testIndex === 1) {
            if (entity instanceof Game) {
                entity.id = test_1.mock.do.save_game_id;
            }
        }
    },
    insertImpl: async () => {
        if (testIndex === 2) return test_2.mock.out.insert_GamePlayer;
    },
    deleteImpl: async () => {
        if (testIndex === 3) return test_3.mock.delete_result;
        if (testIndex === 6) return test_2.mock.out.delete_GamePlayer;
    },
}
