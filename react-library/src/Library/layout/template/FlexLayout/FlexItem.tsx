import { ReactNode } from "react";
//
import s from "./flex-layout.module.sass";



// 
export interface IPropsFlexItem {
    cs?: string,
    content: ReactNode,
    flexibility?: 'none' | 'auto',
    alignmentBump?: 'top' | 'right' | 'bottom' | 'left',
}

export const FlexItem = (
    {
        cs = '', content,
        flexibility = 'none', alignmentBump,
    }: IPropsFlexItem
): JSX.Element => {

    const getStyle = () => {
        const customClass: string[] = [cs, s['flex-item']];
        if (flexibility) customClass.push(s['grow-' + flexibility]);
        if (alignmentBump) customClass.push(s['col_bump-' + alignmentBump]);
        return customClass.join(' ');
    }

    return (
        <div className={getStyle()}>
            {content}
        </div>
    );
}
