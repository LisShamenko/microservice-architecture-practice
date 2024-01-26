import React from 'react';
import { DrawerContent, DrawerFooter } from '@adminjs/design-system';
import { withNotice } from 'adminjs';
// 
import { withRouter } from '../../hooks/withRouter';
import { BulkProps, useBulk, useHandleClick } from '../../helps/BulkComponentsHelper';
import { checkRecords, getButton, getTextInput } from '../../helps/BulkComponentsHelper';

// 
const BulkDescriptionEdit: React.FC<BulkProps> = (props) => {

    const bulk = useBulk('');
    const handleClick = useHandleClick(props, bulk, () => ({
        description: bulk.current,
    }));

    checkRecords(props, bulk);

    return (
        <React.Fragment>
            <DrawerContent>
                {getTextInput(props, bulk, 'description')}
            </DrawerContent>
            <DrawerFooter>
                {getButton(bulk, handleClick)}
            </DrawerFooter>
        </React.Fragment>
    );
};

const formattedBulk = withNotice(
    withRouter(BulkDescriptionEdit),
);

export default formattedBulk;
