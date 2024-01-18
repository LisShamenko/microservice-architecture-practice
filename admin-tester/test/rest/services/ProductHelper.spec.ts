import '../../extends/ExtendedExpects';
import { ModulesPipe } from "../ModuleTestsPipeline";
import * as data from './services.test.data';
import { IProductUpdates, ProductHelper } from '../../../src/rest/services/ProductHelper';

// 
describe('ProductHelper', () => {
    const pipe = new ModulesPipe({
        findOneImpl: data.impls.findOneImpl,
        deleteImpl: data.impls.deleteImpl,
        findImpl: data.impls.findImpl,
        saveImpl: data.impls.saveImpl,
        removeImpl: data.impls.removeImpl,
    }, {});
    let service: ProductHelper;

    beforeAll(async () => {
        await pipe.beforeAll(ProductHelper, { isErrorHelper: true });
        service = pipe.getService(ProductHelper);
        data.setTestService(data.TestServices.ProductHelper);
    });
    afterAll(() => pipe.afterAll());
    afterEach(() => data.nextTest());

    // 
    it('refillProducts', async () => {
        const d = data.test_productHelper_1;
        const tmpProducts = d.in.getProducts();
        await service.refillProducts(tmpProducts, d.in.fillProducts);

        expect(pipe.getRepositoryCalls).toHaveLength(1);

        expect(tmpProducts.length).toBe(4);
        expect(tmpProducts[0]).toMatchObject(d.out[0]);
        expect(tmpProducts[1]).toMatchObject(d.out[1]);
        expect(tmpProducts[2]).toMatchObject(d.out[2]);
        expect(tmpProducts[3]).toMatchObject(d.out[3]);

        pipe.getRepositoryClear();
    });

    it('getTypeUpdates', async () => {
        const d = data.test_productHelper_2;
        let result;

        // 
        result = service.getTypeUpdates(d.none(), d.type_none);
        expect(result).toBeUndefined();

        result = service.getTypeUpdates(d.cloth(), d.type_none);
        expect(result).toMatchObject({ removeCloth: d.subProduct });

        result = service.getTypeUpdates(d.shell(), d.type_none);
        expect(result).toMatchObject({ removeShell: d.subProduct });

        result = service.getTypeUpdates(d.weapon(), d.type_none);
        expect(result).toMatchObject({ removeWeapon: d.subProduct });

        // 
        result = service.getTypeUpdates(d.none(), d.type_cloth);
        expect(result).toMatchObject({ addCloth: { product_id: d.none_id } });

        result = service.getTypeUpdates(d.cloth(), d.type_cloth);
        expect(result).toBeUndefined();

        result = service.getTypeUpdates(d.shell(), d.type_cloth);
        expect(result).toMatchObject({
            addCloth: { product_id: d.shell_id },
            removeShell: d.subProduct,
        });

        result = service.getTypeUpdates(d.weapon(), d.type_cloth);
        expect(result).toMatchObject({
            addCloth: { product_id: d.weapon_id },
            removeWeapon: d.subProduct,
        });

        // 
        result = service.getTypeUpdates(d.none(), d.type_shell);
        expect(result).toMatchObject({ addShell: { product_id: d.none_id } });

        result = service.getTypeUpdates(d.cloth(), d.type_shell);
        expect(result).toMatchObject({
            addShell: { product_id: d.cloth_id },
            removeCloth: d.subProduct,
        });

        result = service.getTypeUpdates(d.shell(), d.type_shell);
        expect(result).toBeUndefined();

        result = service.getTypeUpdates(d.weapon(), d.type_shell);
        expect(result).toMatchObject({
            addShell: { product_id: d.weapon_id },
            removeWeapon: d.subProduct,
        });

        // 
        result = service.getTypeUpdates(d.none(), d.type_weapon);
        expect(result).toMatchObject({ addWeapon: { product_id: d.none_id } });

        result = service.getTypeUpdates(d.cloth(), d.type_weapon);
        expect(result).toMatchObject({
            addWeapon: { product_id: d.cloth_id },
            removeCloth: d.subProduct,
        });

        result = service.getTypeUpdates(d.shell(), d.type_weapon);
        expect(result).toMatchObject({
            addWeapon: { product_id: d.shell_id },
            removeShell: d.subProduct,
        });

        result = service.getTypeUpdates(d.weapon(), d.type_weapon);
        expect(result).toBeUndefined();
    });

    it('updateTypes', async () => {
        await service.updateTypes(pipe.dataSource.createQueryRunner(), {
            removeCloth: { id: 0, product_id: 0 },
            removeShell: { id: 1, product_id: 1 },
            removeWeapon: { id: 2, product_id: 2 },
            addCloth: { id: 3, product_id: 3 },
            addShell: { id: 4, product_id: 4 },
            addWeapon: { id: 5, product_id: 5 },
        } as IProductUpdates);

        expect(pipe.saveCalls).toHaveLength(6);
    });

});
