import '../../extends/ExtendedExpects';
import * as data from './services.test.data';
import { PropertyHelper } from '../../../src/rest/services/PropertyHelper';

// 
describe('PropertyHelper', () => {
    let service: PropertyHelper = new PropertyHelper();

    it('setProperties', async () => {
        const d = data.test_propertyHelper;
        const properties = d.getProperties()
        service.setProperties(properties, d.delta);
        expect(properties).toMatchObject(d.result);
    });
});
