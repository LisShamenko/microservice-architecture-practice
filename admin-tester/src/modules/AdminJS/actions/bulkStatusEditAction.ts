import { Action, BulkActionResponse } from 'adminjs';
// 
//      import { components } from '../components/loader';
import { isAdmin } from '../helps/isAdmin';
import { getHandler } from '../helps/bulkActionsHelper';

// 
export const bulkStatusEditAction: Action<BulkActionResponse> = {
    //      component: components.BulkStatusEdit,
    handler: getHandler((payload) => ({ status: payload })),
    name: 'bulkStatusEdit',
    actionType: 'bulk',
    icon: 'Edit',
    isVisible: true,
    showInDrawer: true,
    isAccessible: isAdmin,
};
