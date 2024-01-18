import '../../extends/ExtendedExpects';
import { ModulesPipe } from "../ModuleTestsPipeline";
import * as data from './game.test.data';
import { GameService } from '../../../src/rest/Game/game.service';

// 
describe('GameService (modules)', () => {
    const pipe = new ModulesPipe({
        findOneImpl: data.impls.findOneImpl,
        deleteImpl: data.impls.deleteImpl,
        findImpl: data.impls.findImpl,
        saveImpl: data.impls.saveImpl,
        insertImpl: data.impls.insertImpl,
    }, {
    });
    let service: GameService;

    beforeAll(async () => {
        await pipe.beforeAll(GameService, {
            isTemplateHelper: true,
            isProductHelper: true,
            isPropertyHelper: true,
            isSkillHelper: true,
            isEffectsHelper: true,
            isErrorHelper: true,
        });
        service = pipe.getService(GameService);
    });
    afterAll(() => pipe.afterAll());
    afterEach(() => data.nextTest());

    // 
    it('insertGame', async () => {
        const d = data.test_1;
        const result = await service.insertGame(d.in.idto);

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(3);
        expect(pipe.findOneCalls).toHaveLength(3);
        expect(pipe.foundErrorCalls).toHaveLength(3);
        expect(pipe.saveCalls).toHaveLength(2);

        const game = pipe.saveCalls[0][0];
        expect(game).toMatchObject(d.mock.in.game);

        const gamePlayer = pipe.saveCalls[1][0];
        expect(gamePlayer).toMatchObject(d.mock.in.gamePlayer);

        pipe.testQueryRunnerSuccess();
        pipe.getRepositoryClear();
        pipe.findOneClear();
        pipe.foundErrorClear();
        pipe.saveClear();
    });

    it('updateGame (replace)', async () => {
        const d = data.test_2;
        const result = await service.updateGame(d.in.game_id, d.in.udto_1);

        expect(result).toMatchObject(d.out.result_1);

        expect(pipe.getRepositoryCalls).toHaveLength(3);
        expect(pipe.foundErrorCalls).toHaveLength(2);
        expect(pipe.findOneCalls).toHaveLength(2);
        expect(pipe.insertCalls).toHaveLength(1);

        const gamePlayer = pipe.insertCalls[0][0];
        expect(gamePlayer).toMatchObject(d.mock.in.insert_or_delete);

        pipe.getRepositoryClear();
        pipe.foundErrorClear();
        pipe.findOneClear();
        pipe.insertClear();
    });

    it('deleteGame', async () => {
        const d = data.test_3;
        const result = await service.deleteGame(
            d.in.game_id, d.in.owner_player_id
        );

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.deleteCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.deleteClear();
    });

    it('getOneGame', async () => {
        const d = data.test_4;
        const result = await service.getOneGame(d.in.game_id);

        expect(result).toStrictEqual(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findOneCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.findOneClear();
        pipe.foundErrorClear();
    });

    it('getAllGames', async () => {
        const d = data.test_5;
        const result = await service.getAllGames();

        expect(result).toStrictEqual(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.findClear();
    });

    it('updateGame (update)', async () => {
        const d = data.test_2;
        const result = await service.updateGame(d.in.game_id, d.in.udto_2);

        expect(result).toMatchObject(d.out.result_2);

        expect(pipe.getRepositoryCalls).toHaveLength(3);
        expect(pipe.foundErrorCalls).toHaveLength(2);
        expect(pipe.findOneCalls).toHaveLength(2);
        expect(pipe.deleteCalls).toHaveLength(1);

        const deleteObj = pipe.deleteCalls[0][0];
        expect(deleteObj).toMatchObject(d.mock.in.insert_or_delete);

        pipe.getRepositoryClear();
        pipe.foundErrorClear();
        pipe.findOneClear();
        pipe.deleteClear();
    });
});
