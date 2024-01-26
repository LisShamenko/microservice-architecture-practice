import React from 'react';
import { PropertyJSON } from 'adminjs';
import { Label, LabelProps } from '@adminjs/design-system';
// 
import PropertyDescription from './PropertyDescription';

// 
export type PropertyLabelProps = {
    property: PropertyJSON;
    props?: LabelProps;
}

const PropertyLabel: React.FC<PropertyLabelProps> = (props) => {
    const { property, props: labelProps } = props;

    if (property.hideLabel) return null;

    return (
        <Label
            htmlFor={property.path}
            required={property.isRequired}
            {...labelProps}
        >
            {property.label}
            {property.description && <PropertyDescription property={property} />}
        </Label>
    )
}

export default PropertyLabel;
