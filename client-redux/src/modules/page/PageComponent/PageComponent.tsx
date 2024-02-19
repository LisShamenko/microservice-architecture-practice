//
import s from './page-component.module.sass';
import { dtoSection } from '../../../redux/reducers/types/dtoSection';



// 
interface IProps {
    section: dtoSection,
}

export const PageComponent = ({ section }: IProps): JSX.Element => {
    return (
        <div className={s['main-section']}>
            {section && (<p>{section.id} - {section.title}</p>)}
        </div>
    );
}
