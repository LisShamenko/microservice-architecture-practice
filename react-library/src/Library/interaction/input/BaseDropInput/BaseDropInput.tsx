import { RefObject, SetStateAction, ChangeEvent, ReactNode, MouseEventHandler } from "react";
//
import s from './base-drop-input.module.sass';
import { ButtonMenuAlignment, DropdownLayout } from "../../../layout/wrapper/DropdownLayout/DropdownLayout";
import { IconsEnum, IconSize } from "../../../visualization/image/Icon/types";
import { IButtonVariant, IIconOffset } from "../../button/JustButton/types";
import { JustButton } from "../../button/JustButton/JustButton";
import { BaseInput, IPropsBaseInput } from "../BaseInput/BaseInput";
import { IconPosition } from "../../../visualization/image/ChildIcon/types";
import { InputType } from "../BaseInput/types";



// 
export interface IButtonInDropInput {
    icon: IconsEnum,
    variant: IButtonVariant,
    onClick: MouseEventHandler<HTMLButtonElement> | undefined,
}



// 
export interface IChildrenBaseDropInput {
    content: ReactNode,
    buttons: IButtonInDropInput[],
}

export type ValueFormat = () => string | number | undefined;

export interface IPropsBaseDropInput {
    children: IChildrenBaseDropInput,
    cs?: string,
    alignment?: ButtonMenuAlignment,
    isStretch?: boolean,
    isBlock?: boolean,
    // 
    base: IPropsBaseInput,
    inputType: InputType,
    valueFormat: ValueFormat,
    startIcon?: IconsEnum,
    onShowInput?: () => void,
    // useOutsideClick
    dropdown: [
        ref: RefObject<HTMLDivElement>,
        isDropdown: boolean,
        setDropdown: (value: SetStateAction<boolean>) => void,
    ]
}

export const BaseDropInput = (
    {
        children, cs = '',
        alignment = ButtonMenuAlignment.bottomRight,
        isStretch = false, isBlock = false,
        base, inputType, valueFormat, startIcon, onShowInput,
        dropdown,
    }: IPropsBaseDropInput
): JSX.Element => {

    const { content, buttons } = children;
    const [ref, isDropdown, setDropdown] = dropdown;

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
    }

    const onFocus = () => {
        setDropdown(true);
        if (onShowInput) onShowInput();
    }

    return (
        <DropdownLayout cs={cs} alignment={alignment}
            isStretch={isStretch} isBlock={isBlock}
            dropdown={[ref, isDropdown]}>
            {{
                trigger: (
                    <BaseInput {...base}
                        type={inputType} value={valueFormat()}
                        sides={{ before: startIcon && { icon: startIcon } }}
                        onChange={onChange} onFocus={onFocus}
                    />
                ),
                panel: (<>
                    {content && (
                        <div className={s['child-container']}>
                            {content}
                        </div>
                    )}
                    {buttons && (
                        <div className={s['buttons-container']}>
                            {buttons.map((item, index) => (
                                <JustButton key={index} cs={s['action-button']}
                                    iconOffset={IIconOffset.xSmall}
                                    variant={item.variant} onClick={item.onClick}
                                    icon={{
                                        after: item.icon,
                                        position: IconPosition.afterToCenter,
                                        size: IconSize.small,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                    {/* 
                    {elements && elements.map((item, index) => (
                        защитник для IButtonInDropInput -> создать кнопку
                        ...
                        защитник для поля -> создать поле
                    ))}
                    */}
                </>),
            }}
        </DropdownLayout>
    );
}
