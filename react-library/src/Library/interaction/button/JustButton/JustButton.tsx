import { CSSProperties, MouseEventHandler } from "react";
//
import s from './just-button.module.sass';
import { ChildIcon, IPropsChildIcon } from "../../../visualization/image/ChildIcon/ChildIcon";
import { IButtonVariant, IIconOffset, IButtonMode } from "./types";



// 
export interface IChildrenJustButton {
    icon?: IPropsChildIcon,
    title?: string,
}

export interface IPropsJustButton extends IChildrenJustButton {
    cs?: string,
    style?: CSSProperties,
    // 
    accessKey?: string,
    tabIndex?: number,
    disabled?: boolean,
    // 
    variant?: IButtonVariant,
    iconOffset?: IIconOffset,
    mode?: IButtonMode,
    isAbsolute?: boolean,
    onClick?: MouseEventHandler<HTMLButtonElement>,
}

export const JustButton = (
    {
        cs = '', style,
        icon, title,
        accessKey, tabIndex, disabled = false,
        variant = IButtonVariant.blue, iconOffset, mode, isAbsolute = false,
        onClick,
    }: IPropsJustButton
): JSX.Element => {

    // 
    const getStyle = () => {
        const customClass: string[] = [cs, s['just-button'], s[`variant-${variant}`]];
        if (iconOffset) customClass.push(s[iconOffset]);
        if (mode) customClass.push(s[mode]);
        if (isAbsolute) customClass.push(s['position-absolute']);
        return customClass.join(' ');
    }

    return (
        <button className={getStyle()} style={style} onClick={onClick}
            accessKey={accessKey} tabIndex={tabIndex} disabled={disabled}
        >
            {icon ? (
                <ChildIcon {...icon}>
                    <div className={s['icon-text']}>{title}</div>
                </ChildIcon>
            ) : (
                <div className={s['icon-text']}>{title}</div>
            )}
        </button>
    );
}
