import '../../extends/ExtendedExpects';
import { ModulesPipe } from "../ModuleTestsPipeline";
import * as data from './template.test.data';
import { TemplateService } from '../../../src/rest/LevelTemplate/template.service';

// 
describe('TemplateService (modules)', () => {
    const pipe = new ModulesPipe({
        findOneImpl: data.impls.findOneImpl,
        deleteImpl: data.impls.deleteImpl,
        findImpl: data.impls.findImpl,
        saveImpl: data.impls.saveImpl,
    }, {
        filterSkillsImpl: data.impls.filterSkillsImpl,
        setPropertiesImpl: data.impls.setPropertiesImpl,
        refillProductsImpl: data.impls.refillProductsImpl,
        addProductsToListImpl: data.impls.addProductsToListImpl,
        addLevelSkillsImpl: data.impls.addLevelSkillsImpl,
        refillLevelSkillsImpl: data.impls.refillLevelSkillsImpl,
    });
    let service: TemplateService;

    beforeAll(async () => {
        await pipe.beforeAll(TemplateService, {
            isTemplateHelper: true,
            isProductHelper: true,
            isPropertyHelper: true,
            isSkillHelper: true,
            isEffectsHelper: true,
            isErrorHelper: true,
        });
        service = pipe.getService(TemplateService);
    });
    afterAll(() => pipe.afterAll());
    afterEach(() => data.nextTest());

    // 
    it('insertTemplate', async () => {
        const d = data.test_1;
        const result = await service.insertTemplate(d.in.idto);

        expect(result).toMatchObject(d.out);

        expect(pipe.setPropertiesCalls).toHaveLength(1);
        expect(pipe.addProductsToListCalls).toHaveLength(1);
        expect(pipe.addLevelSkillsCalls).toHaveLength(1);
        expect(pipe.saveCalls).toHaveLength(5);

        const properties = pipe.saveCalls[0][0];
        expect(properties).toMatchObject(d.mock.in.properties);

        const inventory = pipe.saveCalls[1][0];
        expect(inventory).toMatchObject(d.mock.in.inventory);

        const tmpProducts = pipe.saveCalls[2][0];
        expect(tmpProducts[0]).toMatchObject(d.mock.in.products[0]);
        expect(tmpProducts[1]).toMatchObject(d.mock.in.products[1]);

        const template = pipe.saveCalls[3][0];
        expect(template).toMatchObject(d.mock.in.template);

        const tmpSkills = pipe.saveCalls[4][0];
        expect(tmpSkills[0]).toMatchObject(d.mock.in.skills[0]);
        expect(tmpSkills[1]).toMatchObject(d.mock.in.skills[1]);

        pipe.testQueryRunnerSuccess();
        pipe.setPropertiesClear();
        pipe.addProductsToListClear();
        pipe.addLevelSkillsClear();
        pipe.saveClear();
    });

    it('updateTemplate', async () => {
        const d = data.test_2;
        const result = await service.updateTemplate(d.in.template_id, d.in.udto);

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findOneCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);
        expect(pipe.setPropertiesCalls).toHaveLength(1);
        expect(pipe.refillProductsCalls).toHaveLength(1);
        expect(pipe.filterSkillsCalls).toHaveLength(1);
        expect(pipe.refillLevelSkillsCalls).toHaveLength(1);
        expect(pipe.saveCalls).toHaveLength(4);
        expect(pipe.removeCalls).toHaveLength(2);

        const properties = pipe.saveCalls[0][0];
        expect(properties).toMatchObject(d.mock.in.properties);

        const tmpProducts = pipe.saveCalls[1][0];
        expect(tmpProducts[0]).toMatchObject(d.mock.in.products[0]);
        expect(tmpProducts[1]).toMatchObject(d.mock.in.products[1]);

        const tmpSkills = pipe.saveCalls[2][0];
        expect(tmpSkills[0]).toMatchObject(d.mock.in.skills[0]);
        expect(tmpSkills[1]).toMatchObject(d.mock.in.skills[1]);

        const template = pipe.saveCalls[3][0];
        expect(template).toMatchObject(d.mock.in.template);

        pipe.testQueryRunnerSuccess();
        pipe.getRepositoryClear();
        pipe.findOneClear();
        pipe.foundErrorClear();
        pipe.setPropertiesClear();
        pipe.refillProductsClear();
        pipe.filterSkillsClear();
        pipe.refillLevelSkillsClear();
        pipe.saveClear();
        pipe.removeClear();
    });

    it('deleteTemplate', async () => {
        const d = data.test_3;
        const result = await service.deleteTemplate(d.in.template_id);

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.deleteCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.deleteClear();
    });

    it('getOneTemplate', async () => {
        const d = data.test_4;
        const result = await service.getOneTemplate(d.in.template_id);

        expect(result).toStrictEqual(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findOneCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.findOneClear();
        pipe.foundErrorClear();
    });

    it('getAllTemplates', async () => {
        const d = data.test_5;
        const result = await service.getAllTemplates();

        expect(result).toStrictEqual(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.findClear();
    });
});
