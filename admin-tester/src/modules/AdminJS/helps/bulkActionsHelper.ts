import { ActionContext, ActionHandler, ActionRequest, ActionResponse } from 'adminjs';
import { BulkActionResponse } from 'adminjs';

// 
export type GetDataFunction = (payload?: Record<string, any>) => Record<string, any>;

export const getHandler = (
    getData: GetDataFunction,
): ActionHandler<BulkActionResponse> => {

    return async (
        request: ActionRequest,
        _response: ActionResponse,
        context: ActionContext,
    ) => {
        const { records, resource, h, translateMessage } = context;
        const payload = request.payload;

        if (!records || !records.length) {
            throw new Error('no records were selected.');
        }

        if (request.method === 'get') {
            return {
                records: records.map((record) => record.toJSON(context.currentAdmin)),
            };
        }

        if (request.method === 'post') {
            await Promise.all(
                records.map((record) => resource.update(record.id(), getData(payload))),
            );
            return {
                records: records.map((record) => record.toJSON(context.currentAdmin)),
                notice: {
                    message: translateMessage('success'),
                    type: 'success',
                },
                redirectUrl: h.resourceUrl({
                    resourceId: resource._decorated?.id() || resource.id(),
                }),
            };
        }
        throw new Error('method should be either "post" or "get"');
    }
}
