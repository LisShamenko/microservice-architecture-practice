import { BasePropertyProps } from 'adminjs';
import { ValueGroup } from '@adminjs/design-system';
// 
import PhotoFile from './PhotoFile';

// 
const PhotoFileShow = (props: BasePropertyProps) => {
    const childProps = {
        // record: props.record,
        // property: props.property,
        where: props.where,
        // path: props.property.path,
    }
    return (
        <ValueGroup label={props.property.label}>
            <PhotoFile {...childProps}
                url={props.record.populated['file_id'].params.url}
            />
        </ValueGroup>
    );
};
export default PhotoFileShow;
