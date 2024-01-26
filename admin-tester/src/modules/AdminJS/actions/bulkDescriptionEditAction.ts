import { Action, BulkActionResponse } from 'adminjs';
// 
import { components } from '../components/loader';
import { isAdmin } from '../helps/isAdmin';
import { getHandler } from '../helps/bulkActionsHelper';

// 
export const bulkDescriptionEditAction: Action<BulkActionResponse> = {
    component: components.BulkDescriptionEdit,
    handler: getHandler((payload) => ({ description: payload })),
    name: 'bulkDescriptionEdit',
    actionType: 'bulk',
    icon: 'Edit',
    isVisible: true,
    showInDrawer: true,
    isAccessible: isAdmin,
};
