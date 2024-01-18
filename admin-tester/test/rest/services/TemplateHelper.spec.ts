import '../../extends/ExtendedExpects';
import { ModulesPipe } from "../ModuleTestsPipeline";
import * as data from './services.test.data';
import { TemplateHelper } from '../../../src/rest/services/TemplateHelper';

// 
describe('TemplateHelper', () => {
    const pipe = new ModulesPipe({
        findOneImpl: data.impls.findOneImpl,
        deleteImpl: data.impls.deleteImpl,
        findImpl: data.impls.findImpl,
        saveImpl: data.impls.saveImpl,
        removeImpl: data.impls.removeImpl,
    }, {});
    let service: TemplateHelper;

    beforeAll(async () => {
        await pipe.beforeAll(TemplateHelper, { isErrorHelper: true });
        service = pipe.getService(TemplateHelper);
        data.setTestService(data.TestServices.TemplateHelper);
    });
    afterAll(() => pipe.afterAll());
    afterEach(() => data.nextTest());

    // 
    it('refillProductSkills', async () => {
        const d = data.test_templateHelper;
        const result = await service.getPalyerTemplate(d.in.level_template_id);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findOneCalls).toHaveLength(1);

        expect(result.properties).toMatchObject(d.out.properties);
        expect(result.products).toEqual(d.out.products);
        expect(result.skills).toEqual(d.out.skills);

        pipe.getRepositoryClear();
        pipe.findOneClear();
    });
});
