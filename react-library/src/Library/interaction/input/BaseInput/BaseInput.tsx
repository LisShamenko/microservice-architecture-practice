import { ChangeEventHandler, FocusEventHandler, MouseEventHandler } from "react";
//
import s from './base-input.module.sass';
import useVerification, { IVerifyValue } from "../../../hooks/useVerification";
import { Icon } from "../../../visualization/image/Icon/Icon";
import { IconsEnum, IconSize } from "../../../visualization/image/Icon/types";
import { JustButton } from "../../button/JustButton/JustButton";
import { IButtonVariant, IIconOffset } from "../../button/JustButton/types";
import { InputType, ISideElement } from "./types";
import { Spinner } from "../../../visualization/element/Spinner/Spinner";
import { SpinnerSize } from "../../../visualization/element/Spinner/types";
import { IconPosition } from "../../../visualization/image/ChildIcon/types";



// 
export interface IPropsBaseInput {
    cs?: {
        root?: string,
        input?: string,
    },
    // 
    type?: InputType,
    name: string,
    label?: string,
    value?: string | number,
    placeholder?: string,
    readonly?: boolean,
    disabled?: boolean,
    //
    required?: boolean,
    maxlength?: number,
    regExp?: RegExp,
    regExpTextError?: string,
    // 
    sides?: {
        before?: ISideElement,
        after?: ISideElement,
        spinner?: boolean,
    },
    // 
    onFocus?: FocusEventHandler<HTMLInputElement> | undefined,
    onBlur?: FocusEventHandler<HTMLInputElement> | undefined,
    onChange?: ChangeEventHandler<HTMLInputElement> | undefined,
}

export const BaseInput = (
    {
        cs = {}, type = InputType.text,
        name, label = '', value = '', placeholder,
        readonly = false, disabled = false, required = false, maxlength = 0,
        regExp, regExpTextError,
        sides,
        onFocus, onBlur, onChange,
    }: IPropsBaseInput
): JSX.Element => {

    const v: IVerifyValue = {
        value: value,               // value: '',
        isRequired: required,       // isRequired: true,
        maxlength: maxlength,       // maxlength: 25,
        regExp: regExp,             // regExp: new RegExp('[a-z0-9]'),
        regExpTextError: regExpTextError,   // regExpTextError: 'custom reg exp',
    };

    const { isRequiredError, getErrorNode, isAllErrors } = useVerification();

    // 
    const getStyle = () => {
        return cs.root + ' ' + s['base-input'];
    }
    const getLabelStyle = () => {
        return s['text-label'] + ' ' + s['no-flex'];
    }
    const getContainerStyle = () => {
        return s['text-container'] + ' ' + s['grow'];
    }
    const getInputStyle = () => {
        const customClass: string[] = [s['text-input']];
        if (cs.input) customClass.push(cs.input);
        if (isAllErrors(v)) customClass.push(s['text-input-error']);
        if (sides) {
            if (sides.before) customClass.push(s['text-icon-before']);
            if (sides.after) customClass.push(s['text-icon-after']);
            if (sides.spinner) customClass.push(s['text-spinner']);
        }
        return customClass.join(' ');
    }

    return (
        <div className={getStyle()}>
            <div>
                {label && (
                    <label className={getLabelStyle()} htmlFor={`id_${name}`}>
                        {getErrorNode(v)}
                        {label}
                    </label>
                )}
                <div className={getContainerStyle()}>
                    <input className={getInputStyle()} id={`id_${name}`} type={type}
                        name={name} value={value} placeholder={placeholder}
                        readOnly={readonly} disabled={disabled} required={required}
                        maxLength={maxlength > 0 ? maxlength : 1000}
                        onFocus={onFocus} onBlur={onBlur} onChange={onChange}
                    />

                    {sides?.before && sides.before.isButton && (
                        <JustButton cs={s['button-before']} variant={IButtonVariant.neutral}
                            iconOffset={IIconOffset.xxSmall} isAbsolute={true}
                            onClick={sides.before.onClick}
                            icon={{
                                after: sides.before.icon,
                                position: IconPosition.afterToCenter,
                                size: IconSize.xSmall,
                            }}
                        />
                    )}

                    {sides?.before && (!sides.before.isButton) && (
                        <Icon cs={s['icon-before']} icon={sides.before.icon}
                            size={IconSize.xSmall} isAbsolute={true} />
                    )}

                    <div className={s['right-group']}>
                        {sides?.after && sides.after.isButton && (
                            <JustButton cs={s['icon-after-1']} variant={IButtonVariant.neutral}
                                iconOffset={IIconOffset.xxxSmall} isAbsolute={true}
                                onClick={sides.after.onClick}
                                icon={{
                                    after: sides.after.icon,
                                    position: IconPosition.afterToCenter,
                                    size: IconSize.xxSmall,
                                }}
                            />
                        )}

                        {sides?.after && (!sides.after.isButton) && (
                            <Icon cs={s['icon-after-1']} icon={sides.after.icon}
                                size={IconSize.xSmall} isAbsolute={true} />
                        )}

                        {sides?.spinner && (
                            <Spinner cs={s['icon-after-2']}
                                size={SpinnerSize.xSmall} isAbsolute={true} />
                        )}
                    </div >
                </div>
            </div>
        </div>
    );
}
