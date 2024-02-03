import { useState } from "react";
//
import s from './combo-input.module.sass';
import useOutsideClick from "../../../hooks/useOutsideClick";
import { ButtonMenuAlignment, DropdownLayout } from "../../../layout/wrapper/DropdownLayout/DropdownLayout";
import { Icon } from "../../../visualization/image/Icon/Icon";
import { IconsEnum, IconSize } from "../../../visualization/image/Icon/types";
import { JustButton } from "../../button/JustButton/JustButton";
import { IButtonVariant, IButtonMode } from "../../button/JustButton/types";
import { IPropsBaseInput, BaseInput } from "../BaseInput/BaseInput";
import { InputType } from "../BaseInput/types";



// 
export interface IComboItem {
    cs?: string,
    value: number,
    title: string,
    onClick?: (value: number) => void | undefined,
}



// 
interface IPropsComboInput {
    children: IComboItem[],
    cs?: string,
    base: IPropsBaseInput,
    value?: string | number,
    onSelect?: (value: number, index: number) => void | undefined,
}

export const ComboInput = (
    {
        children, cs = '',
        base, value, onSelect,
    }: IPropsComboInput
): JSX.Element => {

    const dropdown = useOutsideClick(false);
    const [ref, isDropdown, setDropdown] = dropdown;
    const [checkIndex, setCheckIndex] = useState(-1);

    // 
    const onItemClickHook = (item: IComboItem, index: number) => {
        setCheckIndex(index);
        if (onSelect) onSelect(item.value, index);
        if (item.onClick) item.onClick(item.value);
        setDropdown(false);
    }
    const onFocus = () => {
        setDropdown(true);
    }

    return (
        <DropdownLayout cs={cs} alignment={ButtonMenuAlignment.bottomCenter}
            isStretch={true} isBlock={false} dropdown={[ref, isDropdown]}>
            {{
                trigger: (
                    <BaseInput {...base}
                        type={InputType.text} value={value}
                        sides={{ before: { icon: IconsEnum.utility_list } }}
                        onChange={(e) => e.preventDefault()} onFocus={onFocus}
                    />
                ),
                panel: (<>
                    {children && children.map((item, index) => (
                        <div className={s['combo-item']} key={index}>

                            <div className={s['item-icon']}>
                                {(index === checkIndex) && (
                                    <Icon cs={s['icon']} icon={IconsEnum.action_check}
                                        size={IconSize.small} />
                                )}
                            </div>

                            <JustButton cs={s['item-button']} variant={IButtonVariant.neutral}
                                onClick={() => onItemClickHook(item, index)}
                                mode={IButtonMode.listItem} title={item.title}
                            />
                        </div>
                    ))}
                </>),
            }}
        </DropdownLayout>
    );
}
