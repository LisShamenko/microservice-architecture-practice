import { BasePropertyProps } from 'adminjs';
// 
import PhotoFile from './PhotoFile';

// 
const PhotoFileList = (props: BasePropertyProps) => {
    return (
        <PhotoFile where={props.where}
            url={props.record.populated['file_id'].params.url}
        />
    );
};
export default PhotoFileList;
