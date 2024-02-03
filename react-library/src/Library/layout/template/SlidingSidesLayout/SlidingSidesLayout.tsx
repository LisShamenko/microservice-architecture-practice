import { ReactNode } from 'react';
//
import s from './sliding-sides-layout.module.sass';
import { SideItem } from './SideItem';



// 
export interface ISideItem {
    content: ReactNode,
    cs?: string,
    isShow?: boolean,
}



// 
export interface IChildrenSlidingSidesLayout {
    left?: ISideItem[],
    right?: ISideItem[],
}

interface IPropsSlidingSidesLayout {
    children: IChildrenSlidingSidesLayout,
    cs?: string,
}

export const SlidingSidesLayout = (
    {
        children, cs = '',
    }: IPropsSlidingSidesLayout
): JSX.Element => {

    const { left, right } = children;

    // 
    const getStyle = () => {
        return cs + ' ' + s['sliding-sides'];
    }

    return (
        <div className={getStyle()}>
            <div className={s['left-side']}>
                {left && left.map((v, i) => (
                    <SideItem key={i} index={i} {...v} isRight={false} />
                ))}
            </div>
            <div className={s['right-side']}>
                {right && right.map((v, i) => (
                    <SideItem key={i} index={i} {...v} isRight={true} />
                ))}
            </div>
        </div>
    );
}
