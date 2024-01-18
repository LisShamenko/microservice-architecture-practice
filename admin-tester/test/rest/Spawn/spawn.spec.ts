import '../../extends/ExtendedExpects';
import { ModulesPipe } from "../ModuleTestsPipeline";
import * as data from './spawn.test.data';
import { SpawnScriptService } from '../../../src/rest/Spawn/spawn.script.service';

// 
describe('SpawnScriptService (modules)', () => {
    const pipe = new ModulesPipe({
        findOneImpl: data.impls.findOneImpl,
        deleteImpl: data.impls.deleteImpl,
        findImpl: data.impls.findImpl,
        saveImpl: data.impls.saveImpl,
        removeImpl: data.impls.removeImpl,
    }, {});
    let service: SpawnScriptService;

    beforeAll(async () => {
        await pipe.beforeAll(SpawnScriptService, { isErrorHelper: true });
        service = pipe.getService(SpawnScriptService);
    });
    afterAll(() => pipe.afterAll());
    afterEach(() => data.nextTest());

    // 
    it('insertSpawnScript', async () => {
        const d = data.test_1;
        const result = await service.insertSpawnScript(d.in.idto);

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findCalls).toHaveLength(1);
        expect(pipe.foundArrayErrorCalls).toHaveLength(1);
        expect(pipe.saveCalls).toHaveLength(2);

        const spawnScript = pipe.saveCalls[0][0];
        expect(spawnScript).toMatchObject(d.mock.in.spawnScript);

        const addWaves = pipe.saveCalls[1][0];
        expect(addWaves.length).toBe(2);
        expect(addWaves[0]).toMatchObject(d.mock.in.addWaves[0]);
        expect(addWaves[1]).toMatchObject(d.mock.in.addWaves[1]);

        pipe.testQueryRunnerSuccess();

        pipe.getRepositoryClear();
        pipe.findClear();
        pipe.foundArrayErrorClear();
        pipe.saveClear();
    });

    it('updateSpawnScript', async () => {
        const d = data.test_2;
        const result = await service.updateSpawnScript(d.in.spawn_id, d.in.udto);

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(2);
        expect(pipe.findCalls).toHaveLength(1);
        expect(pipe.foundArrayErrorCalls).toHaveLength(1);
        expect(pipe.findOneCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);
        expect(pipe.removeCalls).toHaveLength(1);
        expect(pipe.saveCalls).toHaveLength(2);

        // 
        const addWaves = pipe.saveCalls[0][0];
        expect(addWaves.length).toBe(2);

        expect(addWaves[0]).toMatchObject(d.mock.in.addWaves[0]);
        expect(addWaves[0].script_id).toBe(d.mock.in.spawnScript.id);

        expect(addWaves[1]).toMatchObject(d.mock.in.addWaves[1]);
        expect(addWaves[1].script_id).toBe(d.mock.in.spawnScript.id);

        const spawnScript = pipe.saveCalls[1][0];
        expect(spawnScript.title).toBe(d.mock.in.spawnScript.title);

        // 
        pipe.testQueryRunnerSuccess();

        pipe.getRepositoryClear();
        pipe.findClear();
        pipe.foundArrayErrorClear();
        pipe.findOneClear();
        pipe.foundErrorClear();
        pipe.removeClear();
        pipe.saveClear();
    });

    it('deleteSpawnScript', async () => {
        const d = data.test_3;
        const result = await service.deleteSpawnScript(d.in.spawn_id);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.deleteCalls).toHaveLength(1);

        expect(result).toMatchObject(d.out);

        pipe.getRepositoryClear();
        pipe.deleteClear();
    });

    it('getOneSpawnScript', async () => {
        const d = data.test_4;
        const result = await service.getOneSpawnScript(d.in.spawn_id);

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findOneCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.findOneClear();
        pipe.foundErrorClear();
    });

    it('getAllSpawnScripts', async () => {
        const d = data.test_5;
        const result = await service.getAllSpawnScripts();

        expect(result).toStrictEqual(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.findClear();
    });
});
