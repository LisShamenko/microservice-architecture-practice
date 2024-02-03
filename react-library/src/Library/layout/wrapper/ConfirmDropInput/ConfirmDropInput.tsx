import { PropsWithChildren, useEffect, useState } from "react";
// 
import useOutsideClick from "../../../hooks/useOutsideClick";
import { BaseDropInput, ValueFormat } from "../../../interaction/input/BaseDropInput/BaseDropInput";
import { IPropsBaseInput } from "../../../interaction/input/BaseInput/BaseInput";
import { IButtonVariant } from "../../../interaction/button/JustButton/types";
import { IconsEnum } from "../../../visualization/image/Icon/types";
import { InputType } from "../../../interaction/input/BaseInput/types";



// 
export interface IPropsConfirmDropInput {
    cs?: string,
    base: IPropsBaseInput,
    valueFormat: ValueFormat,
    onShowInput?: () => void,
    onCloseInput?: () => void,
    onApproveInput?: () => void,
    onOutsideClick?: () => void,
}

export const ConfirmDropInput = (
    {
        children, cs = '', base, valueFormat,
        onShowInput, onCloseInput, onApproveInput, onOutsideClick,
    }: PropsWithChildren<IPropsConfirmDropInput>
): JSX.Element => {

    const dropdown = useOutsideClick(false);
    const [ref, isDropdown, setDropdown] = dropdown;
    const [isInside, setInside] = useState(false);

    useEffect(() => {
        if (!isDropdown && !isInside) {
            if (onOutsideClick) onOutsideClick();
        }
    }, [isDropdown, isInside]);

    const onShowPanel = () => {
        setDropdown(true);
        setInside(false);
        if (onShowInput) onShowInput();
    }

    const onClosePanel = () => {
        setDropdown(false);
        setInside(true);
        if (onCloseInput) onCloseInput();
    }

    const onApprovePanel = () => {
        setDropdown(false);
        setInside(true);
        if (onApproveInput) onApproveInput();
    }

    return (
        <BaseDropInput base={base} cs={cs}
            inputType={InputType.text} valueFormat={valueFormat}
            startIcon={IconsEnum.utility_agent_home}
            onShowInput={onShowPanel} dropdown={dropdown}>
            {{
                content: children,
                buttons: [
                    {
                        variant: IButtonVariant.outlineGreen,
                        onClick: onApprovePanel,
                        icon: IconsEnum.action_approval,
                    },
                    {
                        variant: IButtonVariant.outlineRed,
                        onClick: onClosePanel,
                        icon: IconsEnum.action_close,
                    },
                ],
            }}
        </BaseDropInput>
    );
}
