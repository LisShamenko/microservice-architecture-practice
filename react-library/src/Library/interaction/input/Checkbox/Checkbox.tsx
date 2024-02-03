//
import s from './checkbox.module.sass';
import { Icon } from '../../../visualization/image/Icon/Icon';
import { IconsEnum, IconSize } from '../../../visualization/image/Icon/types';
import { CheckModeEnum } from './types';



// 
export interface IPropsCheckbox {
    cs?: string,
    name: string,
    label?: string,
    value?: string | boolean,
    isGroup?: boolean,
    mode?: CheckModeEnum,
    disabled?: boolean,
    required?: boolean,
    isChecked?: boolean | null,
    onChange?: (isClick: boolean, value: string | boolean) => void,
    // 
    isMargin?: boolean,
}

export const Checkbox = (
    {
        cs = '', name, label = '', value = '',
        isGroup = false, mode = CheckModeEnum.check,
        disabled = false, required = false,
        isChecked, onChange,
        //
        isMargin = true,
    }: IPropsCheckbox
): JSX.Element => {

    const onClickToogle = (e: any) => {
        e.preventDefault();
        if (onChange && !disabled) onChange(!isChecked, value);
    }

    //
    const isRequiredError = (): boolean => {
        return (required && !disabled && isChecked === null);
    }
    const getErrorNode = () => {
        if (isRequiredError()) {
            return (<abbr className={s['abbr-required']}>(required)*</abbr>);
        }
        return <></>
    }

    // 
    const getStyle = () => {
        return cs + ' ' + s['checkbox'];
    }
    const getContainerStyle = () => {
        if (disabled) return s['container-disabled'];
    }
    const getCkeckGroupStyle = () => {
        const customClass: string[] = [s['ckeck-group']];
        if (isMargin) customClass.push(s['margin-left-cancel']);
        return customClass.join(' ');
    }
    const getFlagStyle = () => {
        const customClass: string[] = [];

        if (mode === CheckModeEnum.check) customClass.push(s['ckeck-flag']);
        else customClass.push(s['radio-flag']);
        if (isMargin) customClass.push(s['margin-right-cancel']);

        if (disabled) customClass.push(s['flag-disabled']);
        else if (isChecked) customClass.push(s['flag-checked']);
        else customClass.push(s['flag-unchecked']);

        return customClass.join(' ');
    }
    const getIconStyle = () => {
        const customClass: string[] = [];

        if (mode === CheckModeEnum.check) {
            customClass.push(s['flag-icon']);
        }
        else {
            customClass.push(s['radio-flag-icon']);
            customClass.push(s['flag-icon']);
        }

        if (disabled) {
            if (isChecked) customClass.push(s['flag-icon-disabled']);
            else customClass.push(s['flag-icon-hide']);
        }
        else {
            if (!isChecked) customClass.push(s['flag-icon-hide']);
        }

        return customClass.join(' ');
    }

    return (
        <div className={getStyle()}>
            <div className={s['form-element']}>
                <label className={`${s['input-container']} ${getContainerStyle()}`}
                    htmlFor={`id_${name}`} onClick={onClickToogle}>

                    {!isGroup && (
                        <input className={s['input-item']} type="checkbox" checked={isChecked ? true : false}
                            id={`id_${name}`} name={name} value={`${value}`} />
                    )}

                    <span className={getCkeckGroupStyle()}>
                        <span className={getFlagStyle()}>
                            <Icon cs={getIconStyle()} icon={IconsEnum.utility_check}
                                size={mode === 'check' ? IconSize.xxSmall : IconSize.xSmall}
                                isAbsolute={true} />
                        </span>
                    </span>

                    {label && (
                        <span className={s['label-item']}>
                            {getErrorNode()}
                            {label}
                        </span>
                    )}
                </label>
            </div>
        </div >
    );
}
