import { Action, BulkActionResponse } from 'adminjs';
// 
//      import { components } from '../components/loader';
import { isAdmin } from '../helps/isAdmin';
import { getHandler } from '../helps/bulkActionsHelper';

// 
export const bulkNotesEditAction: Action<BulkActionResponse> = {
    //      component: components.BulkNotesEdit,
    handler: getHandler((payload) => ({ notes: payload })),
    name: 'bulkNotesEdit',
    actionType: 'bulk',
    icon: 'Edit',
    isVisible: true,
    showInDrawer: true,
    isAccessible: isAdmin,
};
