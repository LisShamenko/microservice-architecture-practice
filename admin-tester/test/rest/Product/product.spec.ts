import '../../extends/ExtendedExpects';
import { ModulesPipe } from "../ModuleTestsPipeline";
import * as data from './product.test.data';
import { ProductService } from '../../../src/rest/Product/product.service';

// 
describe('ProductService (modules)', () => {
    const pipe = new ModulesPipe({
        findOneImpl: data.impls.findOneImpl,
        deleteImpl: data.impls.deleteImpl,
        findImpl: data.impls.findImpl,
        saveImpl: data.impls.saveImpl,
        removeImpl: data.impls.removeImpl,
    }, {
        addProductSkillsImpl: data.impls.addProductSkillsImpl,
        filterSkillsImpl: data.impls.filterSkillsImpl,
        refillProductSkillsImpl: data.impls.refillProductSkillsImpl,
        getTypeUpdatesImpl: data.impls.getTypeUpdatesImpl,
    });
    let service: ProductService;

    beforeAll(async () => {
        await pipe.beforeAll(ProductService, {
            isSkillHelper: true,
            isProductHelper: true,
            isErrorHelper: true,
        });
        service = pipe.getService(ProductService);
    });
    afterAll(() => pipe.afterAll());
    afterEach(() => data.nextTest());

    // 
    it('insertProduct', async () => {
        const d = data.test_1;
        const result = await service.insertProduct(d.in.idto);

        expect(result).toMatchObject(d.out);

        expect(pipe.addProductSkillsCalls).toHaveLength(1);
        expect(pipe.saveCalls).toHaveLength(3);

        const requirement = pipe.saveCalls[0][0];
        expect(requirement).toMatchObject(d.mock.in.save_Requirement);

        const product = pipe.saveCalls[1][0];
        expect(product).toMatchObject(d.mock.in.save_Product);

        const tmpSkills = pipe.saveCalls[2][0];
        expect(tmpSkills[0]).toMatchObject(d.mock.in.save_ProductSkills[0]);

        pipe.testQueryRunnerSuccess();
        pipe.addProductSkillsClear();
        pipe.saveClear();
    });

    it('updateProduct', async () => {
        const d = data.test_2;
        const result = await service.updateProduct(d.in.product_id, d.in.udto);

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findOneCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);
        expect(pipe.filterSkillsCalls).toHaveLength(1);
        expect(pipe.refillProductSkillsCalls).toHaveLength(1);
        expect(pipe.getTypeUpdatesCalls).toHaveLength(1);
        expect(pipe.saveCalls).toHaveLength(3);
        expect(pipe.removeCalls).toHaveLength(1);
        expect(pipe.updateTypesCalls).toHaveLength(1);

        const requirement = pipe.saveCalls[0][0];
        expect(requirement).toMatchObject(d.mock.in.save_Requirement);

        const tmpSkills = pipe.saveCalls[1][0];
        expect(tmpSkills).toEqual(d.mock.in.save_ProductSkills);

        const product = pipe.saveCalls[2][0];
        expect(product).toMatchObject(d.mock.in.save_Product);

        pipe.testQueryRunnerSuccess();
        pipe.getRepositoryClear();
        pipe.findOneClear();
        pipe.foundErrorClear();
        pipe.filterSkillsClear();
        pipe.refillProductSkillsClear();
        pipe.getTypeUpdatesClear();
        pipe.saveClear();
        pipe.removeClear();
        pipe.updateTypesClear();
    });

    it('deleteProduct', async () => {
        const d = data.test_3;
        const result = await service.deleteProduct(d.in.product_id);

        expect(result).toMatchObject(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.deleteCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.deleteClear();
    });

    it('getOneProduct', async () => {
        const d = data.test_4;
        const result = await service.getOneProduct(d.in.product_id);

        expect(result).toStrictEqual(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findOneCalls).toHaveLength(1);
        expect(pipe.foundErrorCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.findOneClear();
        pipe.foundErrorClear();
    });

    it('getAllProducts', async () => {
        const d = data.test_5;
        const result = await service.getAllProducts();

        expect(result).toStrictEqual(d.out);

        expect(pipe.getRepositoryCalls).toHaveLength(1);
        expect(pipe.findCalls).toHaveLength(1);

        pipe.getRepositoryClear();
        pipe.findClear();
    });
});
