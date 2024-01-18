import '../../extends/ExtendedExpects';
import { ModulesPipe } from "../ModuleTestsPipeline";
import * as data from './map.test.data';
import { MapService } from '../../../src/rest/Map/map.service';

// 
describe('MapService (modules)', () => {
    const pipe = new ModulesPipe({
        findOneImpl: data.impls.findOneImpl,
        deleteImpl: data.impls.deleteImpl,
        findImpl: data.impls.findImpl,
        saveImpl: data.impls.saveImpl,
    }, {
        getPointUpdatesImpl: data.impls.getPointUpdatesImpl,
    });
    let service: MapService;

    beforeAll(async () => {
        await pipe.beforeAll(MapService, {
            isTemplateHelper: true,
            isProductHelper: true,
            isPropertyHelper: true,
            isSkillHelper: true,
            isEffectsHelper: true,
            isErrorHelper: true,
            isMapHelper: true,
        });
        service = pipe.getService(MapService);
    });
    afterAll(() => pipe.afterAll());
    afterEach(() => data.nextTest());

    // 
    it('insertMap', async () => {
        const d = data.test_1;
        const result = await service.insertMap(d.in.idto);

        expect(result).toMatchObject(d.out);

        expect(pipe.saveCalls).toHaveLength(2);

        const map = pipe.saveCalls[0][0];
        expect(map).toMatchObject(d.mock.in.map);

        const mapPoints = pipe.saveCalls[1][0];
        expect(mapPoints).toContainObject(d.mock.in.mapPoints[0]);
        expect(mapPoints).toContainObject(d.mock.in.mapPoints[1]);

        pipe.testQueryRunnerSuccess();
        pipe.saveClear();
    });

    it('updateMap', async () => {
        const d = data.test_2;
        const result = await service.updateMap(d.in.map_id, d.in.udto);

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);
        expect(pipe.findOneCalls).toHaveLength(1);
        expect(pipe.saveCalls).toHaveLength(5);
        expect(pipe.removeCalls).toHaveLength(3);

        const updatePoints = pipe.saveCalls[0][0];
        expect(updatePoints).toStrictEqual(d.mock.in_out.getPointUpdates.updatePoints);

        const updateSpawns = pipe.saveCalls[1][0];
        expect(updateSpawns).toStrictEqual(d.mock.in_out.getPointUpdates.updateSpawns);

        const updateTeleports = pipe.saveCalls[2][0];
        expect(updateTeleports).toStrictEqual(d.mock.in_out.getPointUpdates.updateTeleports);

        const updatePositions = pipe.saveCalls[3][0];
        expect(updatePositions).toStrictEqual(d.mock.in_out.getPointUpdates.updatePositions);

        const map = pipe.saveCalls[4][0];
        expect(map).toMatchObject(d.mock.in.map);

        const removeSpawns = pipe.removeCalls[0][0];
        expect(removeSpawns).toStrictEqual(d.mock.in_out.getPointUpdates.removeSpawns);

        const removeTeleports = pipe.removeCalls[1][0];
        expect(removeTeleports).toStrictEqual(d.mock.in_out.getPointUpdates.removeTeleports);

        const removePositions = pipe.removeCalls[2][0];
        expect(removePositions).toStrictEqual(d.mock.in.removePositions);

        pipe.testQueryRunnerSuccess();
        pipe.getRepositoryClear();
        pipe.foundErrorClear();
        pipe.findOneClear();
        pipe.saveClear();
        pipe.removeClear();
    });

    it('deleteMap', async () => {
        const d = data.test_3;
        const result = await service.deleteMap(d.in.map_id);

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.deleteCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.deleteClear();
    });

    it('getOneMap', async () => {
        const d = data.test_4;
        const result = await service.getOneMap(d.in.map_id);

        expect(result).toStrictEqual(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findOneCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.findOneClear();
        pipe.foundErrorClear();
    });

    it('getAllMaps', async () => {
        const d = data.test_5;
        const result = await service.getAllMaps();

        expect(result).toStrictEqual(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.findClear();
    });
});
