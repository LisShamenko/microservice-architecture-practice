import { useState } from 'react';
//
import s from './toggle-button.module.sass';
import { Icon } from '../../../visualization/image/Icon/Icon';
import { IconsEnum, IconSize } from '../../../visualization/image/Icon/types';



// 
interface IPropsToggleButton {
    cs?: string,
    name: string,
    label?: string,
    isOn?: boolean,
    disabled?: boolean,
    onClick?: (isOn: boolean) => void
}

export const ToggleButton = (
    {
        cs = '', name, label = '',
        isOn = false, disabled = false,
        onClick,
    }: IPropsToggleButton
): JSX.Element => {

    const [isClick, setClick] = useState(isOn);

    const onClickToogle = (e: any) => {
        e.preventDefault();
        const newFlag = !isClick;
        setClick(newFlag);
        if (onClick) onClick(newFlag);
    }

    // 
    const getStyle = () => {
        return cs + ' ' + s['toggle-button'];
    }
    const getContainerStyle = () => {
        if (disabled) return s['container-disabled'];
    }
    const getFlagStyle = () => {
        if (disabled) return s['flag-disabled'];
        if (isClick) return s['flag-checked'];
        return s['flag-unchecked'];
    }
    const getIconStyle = () => {
        if (disabled) return s['flag-icon-disabled'];
        if (!isClick) return s['flag-icon-hide'];
    }
    const getStickStyle = () => {
        if (disabled) return s['stick-icon-disabled'];
        if (isClick) return s['stick-icon-rigth'];
        return s['stick-icon-left'];
    }

    return (
        <div className={getStyle()}>
            <div className={s['form-element']}>
                <label className={`${s['checkbox-container']} ${getContainerStyle()}`} htmlFor={`id_${name}`}
                    onClick={onClickToogle}>

                    <span className={s['label-item']}>
                        {label}
                    </span>

                    <input className={s['input-item']} type="checkbox" id={`id_${name}`} name={name} value="" />

                    <span className={s['ckeck-group']}>
                        <span className={`${s['ckeck-flag']} ${getFlagStyle()}`}></span>
                        <Icon cs={`${s['flag-icon']} ${getIconStyle()}`} icon={IconsEnum.utility_check}
                            size={IconSize.xSmall} isAbsolute={true} />
                        <Icon cs={getStickStyle()} icon={IconsEnum.utility_choice}
                            size={IconSize.small} isAbsolute={true} />
                    </span>
                </label>
            </div>
        </div >
    );
}
