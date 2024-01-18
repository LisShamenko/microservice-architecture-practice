import '../../extends/ExtendedExpects';
import { ModulesPipe } from "../ModuleTestsPipeline";
import * as data from './skill.test.data';
import { SkillService } from '../../../src/rest/Skill/skill.service';

// 
describe('SkillService (modules)', () => {
    const pipe = new ModulesPipe({
        findOneImpl: data.impls.findOneImpl,
        deleteImpl: data.impls.deleteImpl,
        findImpl: data.impls.findImpl,
        saveImpl: data.impls.saveImpl,
        removeImpl: data.impls.removeImpl,
    }, {});
    let service: SkillService;

    beforeAll(async () => {
        await pipe.beforeAll(SkillService, {
            isErrorHelper: true,
        });
        service = pipe.getService(SkillService);
    });
    afterAll(() => pipe.afterAll());
    afterEach(() => data.nextTest());

    // 
    it('insertSkill', async () => {
        const d = data.test_1;
        const result = await service.insertSkill(d.in.idto);

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findOneCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);
        expect(pipe.saveCalls).toHaveLength(2);

        const requirement = pipe.saveCalls[0][0];
        expect(requirement).toMatchObject(d.mock.in.requirement);

        const skill = pipe.saveCalls[1][0];
        expect(skill).toMatchObject(d.mock.in.skill);

        pipe.testQueryRunnerSuccess();

        pipe.getRepositoryClear();
        pipe.findOneClear();
        pipe.foundErrorClear();
        pipe.saveClear();
    });

    it('updateSkill', async () => {
        const d = data.test_2;
        const result = await service.updateSkill(d.in.skill_id, d.in.udto);

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(2);
        expect(pipe.findOneCalls).toHaveLength(2);
        expect(pipe.foundErrorCalls).toHaveLength(2);
        expect(pipe.saveCalls).toHaveLength(2);

        // 
        const requirement = pipe.saveCalls[0][0];
        expect(requirement).toMatchObject(d.mock.in.requirement);

        const skill = pipe.saveCalls[1][0];
        expect(skill).toMatchObject(d.mock.in.skill);

        pipe.testQueryRunnerSuccess();

        pipe.getRepositoryClear();
        pipe.findOneClear();
        pipe.foundErrorClear();
        pipe.saveClear();
    });

    it('deleteSkill', async () => {
        const d = data.test_3;
        const result = await service.deleteSkill(d.in.skill_id);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.deleteCalls).toHaveLength(1);

        expect(result).toMatchObject(d.out);

        pipe.getRepositoryClear();
        pipe.deleteClear();
    });

    it('getOneSkill', async () => {
        const d = data.test_4;
        const result = await service.getOneSkill(d.in.skill_id);

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findOneCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.findOneClear();
        pipe.foundErrorClear();
    });

    it('getAllSkills', async () => {
        const d = data.test_5;
        const result = await service.getAllSkills();

        expect(result).toStrictEqual(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.findClear();
    });

});
