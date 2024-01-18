import { BadRequestException, NotFoundException } from '@nestjs/common';
// 
import { ErrorHelper } from '../../../src/rest/services/ErrorHelper';

// 
describe('ErrorHelper', () => {
    let service: ErrorHelper = new ErrorHelper();

    it('foundError', async () => {
        expect(() => service.foundError({ id: 0 }, 'foundError'))
            .not.toThrow();

        const obj: any = undefined;
        expect(() => service.foundError(obj, 'foundError'))
            .toThrow(NotFoundException);
    })

    it('foundArrayError', async () => {
        expect(() => service.foundArrayError([{ id: 0 }], 'foundArrayError'))
            .not.toThrow();

        expect(() => service.foundArrayError([], 'foundArrayError'))
            .toThrow(NotFoundException);
    })

    it('transactionError', async () => {
        expect(() => service.transactionError('transactionError'))
            .toThrow(BadRequestException);
    })

    it('deleteError', async () => {
        expect(() => service.deleteError('deleteError'))
            .toThrow(BadRequestException);
    })

    it('logicalError', async () => {
        expect(() => service.logicalError('logicalError'))
            .toThrow(BadRequestException);
    })
});
