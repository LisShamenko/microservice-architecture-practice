import React, { useEffect, useState } from 'react';
import { EditPropertyProps } from 'adminjs';
import { Input, FormGroup } from '@adminjs/design-system';
//
import PropertyLabel from '../PropertyLabel';

// 
const PhotoFileEdit: React.FC<EditPropertyProps> = (props: any) => {

    const { onChange, property, record } = props;
    const propValue = record.params?.[property.path] ?? '';
    const [value, setValue] = useState(propValue);
    const error = record.errors?.[property.path];

    useEffect(() => {
        if (value !== propValue) {
            setValue(propValue);
        }
    }, [propValue]);

    return (
        <FormGroup error={Boolean(error)}>
            <PropertyLabel property={property} />
            <Input id={property.path} name={property.path} value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => onChange(property.path, value)}
                disabled={property.isDisabled}
                {...property.props}
            />
        </FormGroup>
    );
};

export { PhotoFileEdit as default, PhotoFileEdit }
