import React from 'react';
import { DrawerContent, DrawerFooter } from '@adminjs/design-system';
import { withNotice } from 'adminjs';
// 
import { withRouter } from '../../hooks/withRouter';
import { BulkProps, useBulk, useHandleClick } from '../../helps/BulkComponentsHelper';
import { checkRecords, getButton, getSelect } from '../../helps/BulkComponentsHelper';
import { getAvailableValues, checkAvailableValues } from '../../helps/BulkComponentsHelper';

// 
const BulkStatusEdit: React.FC<BulkProps> = (props) => {

    const { availableValues, defaultValue } = getAvailableValues(props);

    const bulk = useBulk(defaultValue);
    const handleClick = useHandleClick(props, bulk, () => ({
        status: bulk.current,
    }));

    checkAvailableValues(availableValues, bulk);
    checkRecords(props, bulk);

    return (
        <React.Fragment>
            <DrawerContent>
                {getSelect(props, bulk, 'status', availableValues)}
            </DrawerContent>
            <DrawerFooter>
                {getButton(bulk, handleClick)}
            </DrawerFooter>
        </React.Fragment>
    );
};

const formattedBulk = withNotice(
    withRouter(BulkStatusEdit)
);

export default formattedBulk;
