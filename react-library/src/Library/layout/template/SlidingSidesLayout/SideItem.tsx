import { ReactNode } from 'react';
//
import s from './sliding-sides-layout.module.sass';



// 
interface IPropsSideItem {
    content: ReactNode,
    cs?: string,
    index: number,
    isRight?: boolean,
    isShow?: boolean,
}

export const SideItem = (
    {
        content, cs = '',
        index, isRight = false, isShow = false,
    }: IPropsSideItem
): JSX.Element => {

    // 
    const getStyle = () => {
        return cs + ' ' +
            (isRight ? s['right-item'] : s['left-item']) +
            (isShow ? ' ' + s['show'] : '');
    }

    return (
        <div className={getStyle()} style={{ top: (index === 0) ? '0' : `-${index}00%` }} >
            {content}
        </div>
    );
}
