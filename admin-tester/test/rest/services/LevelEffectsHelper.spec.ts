import '../../extends/ExtendedExpects';
import * as data from './services.test.data';
import { LevelEffectsHelper } from '../../../src/rest/services/LevelEffectsHelper';

// 
describe('LevelEffectsHelper', () => {
    let service: LevelEffectsHelper = new LevelEffectsHelper();

    afterEach(() => data.nextTest());

    // 
    it('addEffects', async () => {
        const d = data.test_levelEffectsHelper;
        const tmpEffects = d.tmpEffects();
        service.addEffects(tmpEffects, d.idtoEffects);

        expect(tmpEffects).toHaveLength(2);
        expect(tmpEffects[1]).toMatchObject(d.idtoEffects[0]);
    })

    it('getRemoveEffects', async () => {
        const d = data.test_levelEffectsHelper;
        const tmpEffects = d.tmpEffects();
        const removeEffects = service.getRemoveEffects(tmpEffects, d.udtoEffects);

        expect(removeEffects).toHaveLength(1);
        expect(removeEffects[0]).toMatchObject(tmpEffects[0]);
    })
});
