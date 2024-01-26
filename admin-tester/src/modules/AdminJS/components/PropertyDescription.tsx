import React from 'react';
import { PropertyJSON } from 'adminjs';
import { Box, Tooltip, Icon } from '@adminjs/design-system';

// 
export type PropertyDescriptionProps = {
    property: PropertyJSON;
}

const PropertyDescription: React.FC<PropertyDescriptionProps> = (props) => {
    const { property } = props;

    if (!property.description) return null;
    const direction = property.custom?.tooltipDirection || 'top';

    return (
        <Box mx="sm" display="inline-flex">
            <Tooltip direction={direction} title={property.description} size="lg">
                <Box>
                    <Icon icon="Help" color="info" />
                </Box>
            </Tooltip>
        </Box>
    )
}

export default PropertyDescription;
