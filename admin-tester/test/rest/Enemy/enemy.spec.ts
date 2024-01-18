import '../../extends/ExtendedExpects';
import { ModulesPipe } from "../ModuleTestsPipeline";
import * as data from './enemy.test.data';
import { EnemyService } from '../../../src/rest/Enemy/enemy.service';

// 
describe('EnemyService (modules)', () => {
    const pipe = new ModulesPipe({
        findOneImpl: data.impls.findOneImpl,
        deleteImpl: data.impls.deleteImpl,
        findImpl: data.impls.findImpl,
        saveImpl: data.impls.saveImpl,
    }, {
        filterSkillsImpl: data.impls.filterSkillsImpl,
        setPropertiesImpl: data.impls.setPropertiesImpl,
        refillProductsImpl: data.impls.refillProductsImpl,
        refillEnemySkillsImpl: data.impls.refillEnemySkillsImpl,
        getEnemyTemplateImpl: data.impls.getEnemyTemplateImpl,
    });
    let service: EnemyService;

    beforeAll(async () => {
        await pipe.beforeAll(EnemyService, {
            isTemplateHelper: true,
            isProductHelper: true,
            isPropertyHelper: true,
            isSkillHelper: true,
            isEffectsHelper: true,
            isErrorHelper: true,
        });
        service = pipe.getService(EnemyService);
    });
    afterAll(() => pipe.afterAll());
    afterEach(() => data.nextTest());

    // 
    it('insertEnemy', async () => {
        const d = data.test_1;
        const result = await service.insertEnemy(d.in.idto);

        expect(result).toMatchObject(d.out);

        expect(pipe.getEnemyTemplateCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);
        expect(pipe.setPropertiesCalls).toHaveLength(1);
        expect(pipe.refillProductsCalls).toHaveLength(1);
        expect(pipe.refillEnemySkillsCalls).toHaveLength(1);
        expect(pipe.saveCalls).toHaveLength(5);

        const properties = pipe.saveCalls[0][0];
        expect(properties).toMatchObject(d.mock.in.properties);

        const inventory = pipe.saveCalls[1][0];
        expect(inventory).toMatchObject(d.mock.in.inventory);

        const tmpProducts = pipe.saveCalls[2][0];
        expect(tmpProducts[0]).toMatchObject(d.mock.in.products[0]);
        expect(tmpProducts[1]).toMatchObject(d.mock.in.products[1]);

        const player = pipe.saveCalls[3][0];
        expect(player).toMatchObject(d.mock.in.enemy);

        const tmpSkills = pipe.saveCalls[4][0];
        expect(tmpSkills[0]).toMatchObject(d.mock.in.skills[0]);
        expect(tmpSkills[1]).toMatchObject(d.mock.in.skills[1]);

        pipe.testQueryRunnerSuccess();
        pipe.getRepositoryClear();
        pipe.getEnemyTemplateClear();
        pipe.foundErrorClear();
        pipe.setPropertiesClear();
        pipe.refillProductsClear();
        pipe.refillEnemySkillsClear();
        pipe.saveClear();
    });

    const baseUpdate = (result: any, d: any) => {

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findOneCalls).toHaveLength(1);
        expect(pipe.setPropertiesCalls).toHaveLength(1);
        expect(pipe.refillProductsCalls).toHaveLength(1);
        expect(pipe.refillEnemySkillsCalls).toHaveLength(1);
        expect(pipe.saveCalls).toHaveLength(4);
        expect(pipe.removeCalls).toHaveLength(2);

        const properties = pipe.saveCalls[0][0];
        expect(properties).toMatchObject(d.mock.in.properties);

        const tmpProducts = pipe.saveCalls[1][0];
        expect(tmpProducts[0]).toMatchObject(d.mock.in.products[0]);
        expect(tmpProducts[1]).toMatchObject(d.mock.in.products[1]);

        const tmpSkills = pipe.saveCalls[2][0];
        expect(tmpSkills).toStrictEqual(d.mock.in.skills);

        const player = pipe.saveCalls[3][0];
        expect(player).toMatchObject(d.mock.in.enemy);

        pipe.testQueryRunnerSuccess();
        pipe.getRepositoryClear();
        pipe.findOneClear();
        pipe.setPropertiesClear();
        pipe.refillProductsClear();
        pipe.refillEnemySkillsClear();
        pipe.saveClear();
        pipe.removeClear();
    }

    it('updateEnemy (replace)', async () => {
        const d = data.test_2;
        const result = await service.updateEnemy(d.in.enemy_id, d.in.udto);
        baseUpdate(result, d);

        expect(pipe.getEnemyTemplateCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(2);

        pipe.getEnemyTemplateClear();
        pipe.foundErrorClear();
    });

    it('deleteEnemy', async () => {
        const d = data.test_3;
        const result = await service.deleteEnemy(d.in.enemy_id);

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.deleteCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.deleteClear();
    });

    it('getOneEnemy', async () => {
        const d = data.test_4;
        const result = await service.getOneEnemy(d.in.enemy_id);

        expect(result).toStrictEqual(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findOneCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.findOneClear();
        pipe.foundErrorClear();
    });

    it('getAllEnemies', async () => {
        const d = data.test_5;
        const result = await service.getAllEnemies();

        expect(result).toStrictEqual(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.findClear();
    });

    it('updateEnemy (update)', async () => {
        const d = data.test_6;
        const result = await service.updateEnemy(d.in.enemy_id, d.in.udto);
        baseUpdate(result, d);
        
        expect(pipe.filterSkillsCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);

        pipe.filterSkillsClear();
        pipe.foundErrorClear();
    });
});
