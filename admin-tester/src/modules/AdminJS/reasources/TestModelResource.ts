import { ActionHandler, BulkActionResponse, ResourceWithOptions } from "adminjs";
import { ActionContext, ActionRequest, ActionResponse } from "adminjs";
// 
import { admin } from "src/modules/Postgres/entity/entities";
import { bulkDescriptionEditAction } from "../actions/bulkDescriptionEditAction";
import { isAdmin } from "../helps/isAdmin";
import { components } from '../components/loader';

// 
export const TestModelResource: ResourceWithOptions = {
    resource: admin.TestModel,
    options: {
        navigation: {
            name: 'Test Model',
            // https://carbondesignsystem.com/guidelines/icons/library/
            icon: 'Accessibility',
        },
        listProperties: [
            'id',
            'title',
            'description',
            'photo_url',
            'notes',
            'status',
            'user_id',
            'file_id',
        ],
        editProperties: [
            'id',
            'title',
            'description',
            'photo_url',
            'notes',
            'status',
            'user_id',
            'file_id',
        ],
        actions: {
            new: { isAccessible: isAdmin },
            delete: { isAccessible: isAdmin },
            edit: {
                isAccessible: isAdmin,
                before: (request: ActionRequest, context: ActionContext) => {
                    console.log('--- BEFORE');
                    return request;
                },
                after: (response: ActionResponse, request: ActionRequest, context: ActionContext) => {
                    console.log('--- AFTER');
                    return response;
                },
                component: components.TestModelEdit,
            },
            bulkDelete: { isAccessible: isAdmin },
            bulkDescriptionEdit: bulkDescriptionEditAction,
        },
        sort: {
            sortBy: 'id',
            direction: 'desc',
        },
        properties: {
            description: {
                type: 'textarea',
            },
            photo_url: {
                components: {
                    show: components.PhotoFileShow,
                    list: components.PhotoFileList,
                    edit: components.PhotoFileEdit,
                },
            },
        },
    },
};
