import { MouseEvent, useState } from "react";
//
import s from './steps-indicator.module.sass';
import { Separator } from '../../../visualization/element/Separator/Separator';
import { IButtonVariant, IIconOffset } from "../JustButton/types";
import { JustButton } from "../JustButton/JustButton";
import { IconsEnum, IconSize } from "../../../visualization/image/Icon/types";
import { IStep, StepType } from "./types";
import { IconPosition } from "../../../visualization/image/ChildIcon/types";



// 
interface IPropsStepsIndicator {
    children: IStep[],
    cs?: string,
}

export const StepsIndicator = (
    {
        children, cs = '',
    }: IPropsStepsIndicator
): JSX.Element => {

    const steps = children;

    // 
    const [progress, setProgress] = useState(0);

    const getStepButton = (item: IStep, index: number, count: number) => {
        const { buttonType, onClick } = item;

        // 
        let iconName: IconsEnum = IconsEnum.none;
        if (buttonType === 'success') iconName = IconsEnum.utility_success;
        else if (buttonType === 'error') iconName = IconsEnum.utility_error;
        else if (buttonType === 'choice') iconName = IconsEnum.utility_choice;

        let variant: IButtonVariant = IButtonVariant.blue;
        if (buttonType === 'error') variant = IButtonVariant.red;
        else if (buttonType === 'choice') variant = IButtonVariant.base;

        const onClickStep = (e: MouseEvent<HTMLButtonElement>) => {
            if (onClick) onClick();
            if (buttonType === StepType.success) {
                setProgress(100 * index / (count - 1));
            }
        }

        // 
        const getButtonStyle = () => {
            if (buttonType === 'choice') {
                return s['button-step'] + ' ' + s['gray'];
            }
            return s['button-step'];
        }

        return (
            <JustButton key={index} cs={getButtonStyle()} variant={variant}
                iconOffset={IIconOffset.xxSmall} onClick={onClickStep}
                icon={{
                    size: IconSize.xSmall,
                    after: iconName,
                    position: IconPosition.afterToCenter,
                }}
            />
        );
    }

    // 
    const getStyle = () => {
        return cs + ' ' + s['steps-indicator'];
    }

    return (
        <div className={getStyle()}>
            <Separator progress={progress} />
            <div className={s['buttons-container']}>
                {steps && steps.map((item, index) => getStepButton(item, index, steps.length))}
            </div>
        </div>
    );
}
