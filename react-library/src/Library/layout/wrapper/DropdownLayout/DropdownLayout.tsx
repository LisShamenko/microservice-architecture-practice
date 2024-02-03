import { RefObject, ReactNode } from "react";
//
import s from './dropdown-layout.module.sass';
import { ButtonMenuAlignment } from "./types";



// 
export interface IChildrenDropdownLayout {
    trigger: ReactNode,
    panel: ReactNode,
}

export interface IPropsDropdownLayout {
    children: IChildrenDropdownLayout,
    cs?: string,
    alignment?: ButtonMenuAlignment,
    isStretch?: boolean,
    isBlock?: boolean,
    // useOutsideClick
    dropdown: [
        ref: RefObject<HTMLDivElement>,
        isDropdown: boolean,
    ]
}

export const DropdownLayout = (
    {
        children, cs = '',
        alignment = ButtonMenuAlignment.bottomRight,
        isStretch = false, isBlock = false,
        dropdown,

    }: IPropsDropdownLayout
): JSX.Element => {

    const { trigger, panel } = children;
    const [ref, isDropdown] = dropdown;

    // 
    const getStyle = () => {
        const customClass: string[] = [cs, s['dropdown-layout']];
        if (isDropdown) customClass.push(s['is-open']);
        if (isBlock) customClass.push(s['is-block']);
        return customClass.join(' ');
    }
    const getDropdownStyle = () => {
        const customClass: string[] = [s['dropdown']];
        if (alignment) customClass.push(s[alignment]);
        if (isStretch) customClass.push(s['is-stretch']);
        return customClass.join(' ');
    }

    return (
        <div className={getStyle()} ref={ref}>
            {trigger}
            <div className={getDropdownStyle()}>
                <div className={s['dropdown-list']}>
                    {panel}
                </div>
            </div>
        </div>
    );
}
export { ButtonMenuAlignment };

