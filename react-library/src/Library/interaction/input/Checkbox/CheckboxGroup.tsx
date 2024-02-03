import { useState } from 'react';
//
import s from './checkbox.module.sass';
import { Checkbox, IPropsCheckbox } from './Checkbox';
import { CheckModeEnum } from './types';



// 
interface IPropsCheckboxGroup {
    children: IPropsCheckbox[],
    cs?: string,
    name: string,
    label?: string,
    mode?: CheckModeEnum,
    disabled?: boolean,
    onGroupChange?: (groupValue: string[], index: number, isClick: boolean, value: string | boolean) => void
}

export const CheckboxGroup = (
    {
        children, cs = '',
        name, label = 'Options:', mode = CheckModeEnum.check,
        disabled = false,
        onGroupChange,
    }: IPropsCheckboxGroup
): JSX.Element => {

    const [checkFlags, setCheckFlags] = useState<boolean[]>(
        Array.from(
            { length: children.length },
            (v, i) => children[i].isChecked ? true : false,
        )
    );

    const getGroupValues = (flags: boolean[]) => {
        return flags.reduce<string[]>(
            (arr, item, index) => item ? [...arr, `${children[index].value}`] : arr,
            []
        );
    }

    const getGroupChange = (index: number) => (isClick: boolean, value: string | boolean) => {

        if (mode === CheckModeEnum.radio) {
            const count = checkFlags.reduce((p, c) => c ? p + 1 : p, 0);
            if (count === 1 && !isClick) return;
        }

        const newFlags = checkFlags.map((v, i) => {
            if (index === i) return isClick;
            if (mode === 'check') return v;
            return false
        });
        setCheckFlags(newFlags);

        const groupValue = getGroupValues(newFlags);
        if (onGroupChange) onGroupChange(groupValue, index, isClick, value);
    }

    //      useEffect(() => {
    //          setCheckFlags(Array.from(
    //              { length: children.length },
    //              (v, i) => children[i].isChecked ? true : false,
    //          ));
    //      }, [mode]);

    // 
    const getStyle = () => {
        return cs + ' ' + s['checkbox'];
    }
    const getContainerStyle = () => {
        if (disabled) return s['container-disabled'];
    }

    return (
        <div className={getStyle()}>
            <label className={s['checkbox-container'] + ' ' + getContainerStyle()}
                htmlFor={`id_${name}`}>
                <span>
                    {label}
                </span>
            </label>

            <input className={s['input-item']} name={name} type="checkbox" id={`id_${name}`}
                checked={checkFlags.find(v => v)} value={getGroupValues(checkFlags)}
            />

            {checkFlags && checkFlags.map((item, index) => {
                return (
                    <Checkbox key={index} {...children[index]} isGroup={true} mode={mode}
                        disabled={disabled ? true : children[index].disabled}
                        isChecked={checkFlags[index]} onChange={getGroupChange(index)}
                    />
                )
            })}
        </div>
    );
}
