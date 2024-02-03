//
import s from './flex-layout.module.sass';
import { FlexItem, IPropsFlexItem } from "./FlexItem";



// 
interface IPropsFlexLayout {
    children: IPropsFlexItem[],
    cs?: string,
    multipleRows?: boolean,
    horizontalAlign?: 'center' | 'space' | 'spread' | 'end',
    verticalAlign?: 'start' | 'center' | 'end' | 'stretch',
    pullToBoundary?: 'none' | 'xxx-small' | 'xx-small' | 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | 'xx-large',
}

export const FlexLayout = (
    {
        children, cs = '',
        multipleRows = false,
        horizontalAlign = 'center', verticalAlign = 'center', pullToBoundary = 'none',
    }: IPropsFlexLayout
): JSX.Element => {

    const getStyle = () => {
        const customClass: string[] = [cs, s['flex-layout']];
        if (multipleRows) customClass.push(s['wrap']);
        if (horizontalAlign) customClass.push(s['flex-hor-' + horizontalAlign]);
        if (verticalAlign) customClass.push(s['flex-ver-' + verticalAlign]);
        if (pullToBoundary) customClass.push(s['flex-margin-' + pullToBoundary]);
        return customClass.join(' ');
    }

    return (
        <div className={getStyle()}>
            {children && children.map((item, index) => (
                <FlexItem key={index} {...item} />
            ))}
        </div>
    );
}
