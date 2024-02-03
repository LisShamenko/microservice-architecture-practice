import { useState } from 'react';
//
import { IconPosition } from '../../../visualization/image/ChildIcon/ChildIcon';
import { IconsEnum, IconSize } from '../../../visualization/image/Icon/types';
import { JustButton } from '../JustButton/JustButton';
import { IButtonVariant, IIconOffset } from '../JustButton/types';



// 
interface IPropsCheckboxButton {
    cs?: string,
    isOn?: boolean,
    disabled?: boolean,
    onClick?: (isOn: boolean) => void,
}

export const CheckboxButton = (
    {
        cs = '',
        isOn = false, disabled = false,
        onClick,
    }: IPropsCheckboxButton
): JSX.Element => {

    const [isClick, setClick] = useState(isOn);

    const onClickToogle = (e: any) => {
        e.preventDefault();
        const newFlag = !isClick;
        setClick(newFlag);
        if (onClick) onClick(newFlag);
    }

    return (
        <JustButton cs={cs} variant={isClick ? IButtonVariant.blue : IButtonVariant.neutral}
            disabled={disabled} onClick={onClickToogle} iconOffset={IIconOffset.xxSmall}
            icon={{
                after: isClick ? IconsEnum.utility_check : IconsEnum.utility_add,
                position: IconPosition.afterToCenter,
                size: IconSize.small,
            }}
        />
    );
}
