import '../../extends/ExtendedExpects';
import { ModulesPipe } from "../ModuleTestsPipeline";
import * as data from './player.test.data';
import { PlayerService } from '../../../src/rest/Player/player.service';

// 
describe('PlayerService (modules)', () => {
    const pipe = new ModulesPipe({
        findOneImpl: data.impls.findOneImpl,
        deleteImpl: data.impls.deleteImpl,
        findImpl: data.impls.findImpl,
        saveImpl: data.impls.saveImpl,
    }, {
        filterSkillsImpl: data.impls.filterSkillsImpl,
        getPalyerTemplateImpl: data.impls.getPalyerTemplateImpl,
        setPropertiesImpl: data.impls.setPropertiesImpl,
        refillProductsImpl: data.impls.refillProductsImpl,
        refillPlayerSkillsImpl: data.impls.refillPlayerSkillsImpl,
        addEffectsImpl: data.impls.addEffectsImpl,
        getRemoveEffectsImpl: data.impls.getRemoveEffectsImpl,
    });
    let service: PlayerService;

    beforeAll(async () => {
        await pipe.beforeAll(PlayerService, {
            isTemplateHelper: true,
            isProductHelper: true,
            isPropertyHelper: true,
            isSkillHelper: true,
            isEffectsHelper: true,
            isErrorHelper: true,
        });
        service = pipe.getService(PlayerService);
    });
    afterAll(() => pipe.afterAll());
    afterEach(() => data.nextTest());

    // 
    it('insertPlayer', async () => {
        const d = data.test_1;
        const result = await service.insertPlayer(d.in.idto);

        expect(result).toMatchObject(d.out);

        expect(pipe.getPalyerTemplateCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);
        expect(pipe.setPropertiesCalls).toHaveLength(1);
        expect(pipe.refillProductsCalls).toHaveLength(1);
        expect(pipe.refillPlayerSkillsCalls).toHaveLength(1);
        expect(pipe.addEffectsCalls).toHaveLength(1);
        expect(pipe.saveCalls).toHaveLength(6);

        const properties = pipe.saveCalls[0][0];
        expect(properties).toMatchObject(d.mock.in.properties);

        const inventory = pipe.saveCalls[1][0];
        expect(inventory).toMatchObject(d.mock.in.inventory);

        const tmpProducts = pipe.saveCalls[2][0];
        expect(tmpProducts[0]).toMatchObject(d.mock.in.products[0]);
        expect(tmpProducts[1]).toMatchObject(d.mock.in.products[1]);

        const player = pipe.saveCalls[3][0];
        expect(player).toMatchObject(d.mock.in.player);

        const tmpSkills = pipe.saveCalls[4][0];
        expect(tmpSkills[0]).toMatchObject(d.mock.in.skills[0]);
        expect(tmpSkills[1]).toMatchObject(d.mock.in.skills[1]);

        const tmpEffects = pipe.saveCalls[5][0];
        expect(tmpEffects[0]).toMatchObject(d.mock.in.effects[0]);

        pipe.testQueryRunnerSuccess();
        pipe.getRepositoryClear();
        pipe.getPalyerTemplateClear();
        pipe.foundErrorClear();
        pipe.setPropertiesClear();
        pipe.refillProductsClear();
        pipe.refillPlayerSkillsClear();
        pipe.addEffectsClear();
        pipe.saveClear();
    });

    it('updatePlayer', async () => {
        const d = data.test_2;
        const result = await service.updatePlayer(d.in.player_id, d.in.udto);

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findOneCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);
        expect(pipe.setPropertiesCalls).toHaveLength(1);
        expect(pipe.refillProductsCalls).toHaveLength(1);
        expect(pipe.filterSkillsCalls).toHaveLength(1);
        expect(pipe.refillPlayerSkillsCalls).toHaveLength(1);
        expect(pipe.addEffectsCalls).toHaveLength(1);
        expect(pipe.getRemoveEffectsCalls).toHaveLength(1);
        expect(pipe.saveCalls).toHaveLength(5);
        expect(pipe.removeCalls).toHaveLength(3);

        const properties = pipe.saveCalls[0][0];
        expect(properties).toMatchObject(d.mock.in.properties);

        const tmpProducts = pipe.saveCalls[1][0];
        expect(tmpProducts[0]).toMatchObject(d.mock.in.products[0]);
        expect(tmpProducts[1]).toMatchObject(d.mock.in.products[1]);

        const tmpSkills = pipe.saveCalls[2][0];
        expect(tmpSkills[0]).toMatchObject(d.mock.in.skills[0]);
        expect(tmpSkills[1]).toMatchObject(d.mock.in.skills[1]);

        const tmpEffects = pipe.saveCalls[3][0];
        expect(tmpEffects[0]).toMatchObject(d.mock.in.effects[0]);

        const player = pipe.saveCalls[4][0];
        expect(player).toMatchObject(d.mock.in.player);

        pipe.testQueryRunnerSuccess();
        pipe.getRepositoryClear();
        pipe.findOneClear();
        pipe.foundErrorClear();
        pipe.setPropertiesClear();
        pipe.refillProductsClear();
        pipe.filterSkillsClear();
        pipe.refillPlayerSkillsClear();
        pipe.addEffectsClear();
        pipe.getRemoveEffectsClear();
        pipe.saveClear();
        pipe.removeClear();
    });

    it('deletePlayer', async () => {
        const d = data.test_3;
        const result = await service.deletePlayer(d.in.player_id);

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.deleteCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.deleteClear();
    });

    it('getOnePlayer', async () => {
        const d = data.test_4;
        const result = await service.getOnePlayer(d.in.player_id);

        expect(result).toStrictEqual(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findOneCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.findOneClear();
        pipe.foundErrorClear();
    });

    it('getAllPlayers', async () => {
        const d = data.test_5;
        const result = await service.getAllPlayers();

        expect(result).toStrictEqual(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.findClear();
    });
});
