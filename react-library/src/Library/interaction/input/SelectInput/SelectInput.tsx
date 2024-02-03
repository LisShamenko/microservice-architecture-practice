//
import useOutsideClick from "../../../hooks/useOutsideClick";
import { DropdownLayout } from "../../../layout/wrapper/DropdownLayout/DropdownLayout";
import { ButtonMenuAlignment } from "../../../layout/wrapper/DropdownLayout/types";
import { IconsEnum } from "../../../visualization/image/Icon/types";
import { JustButton } from "../../button/JustButton/JustButton";
import { IButtonVariant, IButtonMode } from "../../button/JustButton/types";
import { BaseInput, IPropsBaseInput } from "../BaseInput/BaseInput";
import { InputType } from "../BaseInput/types";



// 
export interface ISelectItem {
    cs?: string,
    value: number,
    title: string,
    onSelectItem?: (value: number) => void | undefined,
}



// 
interface IPropsSelectInput {
    children: ISelectItem[],
    cs?: string,
    base: IPropsBaseInput,
    value?: string | number,
    onSelect?: (value: number, index: number) => void | undefined,
}

export const SelectInput = (
    {
        children, cs = '',
        base, value, onSelect,
    }: IPropsSelectInput
): JSX.Element => {

    const dropdown = useOutsideClick(false);
    const [ref, isDropdown, setDropdown] = dropdown;

    // 
    const onResetClick = () => {
        if (onSelect) onSelect(-1, -1);
        setDropdown(false);
    }
    const onItemClick = (item: ISelectItem, index: number) => {
        if (onSelect) onSelect(item.value, index);
        if (item.onSelectItem) item.onSelectItem(item.value);
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
                    <JustButton variant={IButtonVariant.outlineRed}
                        onClick={() => onResetClick()}
                        mode={IButtonMode.listItem}
                        title={'Сбросить выбор'}
                    />

                    {children && children.map((item, index) => (
                        <JustButton key={index} variant={IButtonVariant.neutral}
                            onClick={() => onItemClick(item, index)}
                            mode={IButtonMode.listItem}
                            title={item.title}
                        />
                    ))}
                </>),
            }}
        </DropdownLayout>
    );
}
