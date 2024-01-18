import '../../extends/ExtendedExpects';
import { ModulesPipe } from "../ModuleTestsPipeline";
import * as data from './services.test.data';
import { SkillHelper } from '../../../src/rest/services/SkillHelper';
import { ProductSkill } from '../../../src/modules/Postgres/entity/ProductSkill';

// 
describe('SkillHelper', () => {
    const pipe = new ModulesPipe({
        findOneImpl: data.impls.findOneImpl,
        deleteImpl: data.impls.deleteImpl,
        findImpl: data.impls.findImpl,
        saveImpl: data.impls.saveImpl,
        removeImpl: data.impls.removeImpl,
    }, {});
    let service: SkillHelper;

    beforeAll(async () => {
        await pipe.beforeAll(SkillHelper, { isErrorHelper: true });
        service = pipe.getService(SkillHelper);
        data.setTestService(data.TestServices.SkillHelper);
    });
    afterAll(() => pipe.afterAll());
    afterEach(() => data.nextTest());

    // 
    it('refillProductSkills', async () => {
        const d = data.test_skillHelper;
        const tmpSkills = d.in.getTmpSkills();

        await service.refillProductSkills(tmpSkills, d.in.fillSkills);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findCalls).toHaveLength(1);

        expect(tmpSkills.length).toBe(2);
        expect(tmpSkills[0]).toMatchObject(d.out.refillResult[0]);
        expect(tmpSkills[1]).toMatchObject(d.out.refillResult[1]);

        pipe.getRepositoryClear();
        pipe.findClear();
    });

    it('filterSkills', async () => {
        const d = data.test_skillHelper;
        const tmpSkills = d.in.getTmpSkills();

        const result = service.filterSkills<ProductSkill>(tmpSkills, d.in.fillSkills);

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject(d.out.filterResult);
    });
});
