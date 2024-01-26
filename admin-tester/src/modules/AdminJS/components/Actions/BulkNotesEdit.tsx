import React from 'react';
import { DrawerContent, DrawerFooter } from '@adminjs/design-system';
import { withNotice } from 'adminjs';
// 
import { withRouter } from '../../hooks/withRouter';
import { BulkProps, useBulk, useHandleClick } from '../../helps/BulkComponentsHelper';
import { checkRecords, getButton, getTextInput } from '../../helps/BulkComponentsHelper';

// 
const BulkNotesEdit: React.FC<BulkProps> = (props) => {

    const bulk = useBulk('');
    const handleClick = useHandleClick(props, bulk, () => ({
        notes: bulk.current,
    }));

    checkRecords(props, bulk);

    return (
        <React.Fragment>
            <DrawerContent>
                {getTextInput(props, bulk, 'notes')}
            </DrawerContent>
            <DrawerFooter>
                {getButton(bulk, handleClick)}
            </DrawerFooter>
        </React.Fragment>
    );
};

const formattedBulk = withNotice(
    withRouter(BulkNotesEdit)
);

export default formattedBulk;
