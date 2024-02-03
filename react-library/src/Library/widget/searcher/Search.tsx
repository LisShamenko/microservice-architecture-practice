import { MouseEventHandler } from "react";
// 
import { BaseInput, IPropsBaseInput } from "../../interaction/input/BaseInput/BaseInput";
import { IconsEnum } from "../../visualization/image/Icon/types";
import { InputType } from "../../interaction/input/BaseInput/types";



// 
interface IPropsSearch extends IPropsBaseInput {
    // base: IPropsBaseInput,
    isSpinner?: boolean,
    onClickClear?: MouseEventHandler<HTMLButtonElement> | undefined,
}

export const Search = (props: IPropsSearch): JSX.Element => {
    const base = props as IPropsBaseInput;
    const { isSpinner = false, onClickClear } = props;

    // 
    const onStopForm = (e: any) => {
        e.preventDefault();
        if (onClickClear) onClickClear(e);
    }

    return (
        <BaseInput type={InputType.text}
            sides={{
                before: {
                    icon: IconsEnum.utility_search,
                },
                after: {
                    isButton: true,
                    icon: IconsEnum.utility_clear,
                    onClick: onStopForm,
                },
                spinner: isSpinner,
            }}
            {...base}
        />
    );
}
