import '../../extends/ExtendedExpects';
import { ModulesPipe } from "../ModuleTestsPipeline";
import * as data from './services.test.data';
import { MapHelper } from '../../../src/rest/services/MapHelper';

// 
describe('MapHelper', () => {
    const pipe = new ModulesPipe({
        findOneImpl: data.impls.findOneImpl,
        deleteImpl: data.impls.deleteImpl,
        findImpl: data.impls.findImpl,
        saveImpl: data.impls.saveImpl,
        removeImpl: data.impls.removeImpl,
    }, {});
    let service: MapHelper;

    beforeAll(async () => {
        await pipe.beforeAll(MapHelper, { isErrorHelper: true });
        service = pipe.getService(MapHelper);
        data.setTestService(data.TestServices.MapHelper);
    });
    afterAll(() => pipe.afterAll());
    afterEach(() => data.nextTest());

    //
    it('getTypeUpdates', async () => {
        const d = data.test_MapHelper;
        const result = service.getPointUpdates(d.map, d.udto_points);

        expect(result.updatePositions).toContainObject(d.out.updatePositions[0]);
        expect(result.updatePositions).toContainObject(d.out.updatePositions[0]);

        expect(result.updatePoints).toContainObject(d.out.updatePoints[0]);
        expect(result.updatePoints).toContainObject(d.out.updatePoints[1]);
        expect(result.updatePoints).toContainObject(d.out.updatePoints[2]);
        expect(result.updatePoints).toContainObject(d.out.updatePoints[3]);
        expect(result.updatePoints).toContainObject(d.out.updatePoints[4]);
        expect(result.updatePoints).toContainObject(d.out.updatePoints[5]);
        expect(result.updatePoints).toContainObject(d.out.updatePoints[6]);

        expect(result.removeSpawns).toContainObject(d.out.removeSpawns[0]);
        expect(result.removeSpawns).toContainObject(d.out.removeSpawns[1]);

        expect(result.removeTeleports).toContainObject(d.out.removeTeleports[0]);
        expect(result.removeTeleports).toContainObject(d.out.removeTeleports[1]);

        expect(result.updateSpawns).toContainObject(d.out.updateSpawns[0]);
        expect(result.updateSpawns).toContainObject(d.out.updateSpawns[1]);

        expect(result.updateTeleports).toContainObject(d.out.updateTeleports[0]);
        expect(result.updateTeleports).toContainObject(d.out.updateTeleports[1]);
    });
});
