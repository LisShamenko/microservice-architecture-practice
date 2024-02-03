import { MouseEventHandler, PropsWithChildren } from 'react';
//
import s from './row-selector.module.sass';
import { IconPosition } from '../../../visualization/image/ChildIcon/ChildIcon';
import { JustButton } from '../../../interaction/button/JustButton/JustButton';
import { IButtonVariant, IIconOffset } from '../../../interaction/button/JustButton/types';
import { IconsEnum } from '../../../visualization/image/Icon/types';



// 
interface IPropsRowSelector {
    cs?: string,
    onClickPrev: MouseEventHandler<HTMLButtonElement> | undefined,
    onClickNext: MouseEventHandler<HTMLButtonElement> | undefined,
}

export const RowSelector = (
    {
        children, cs = '',
        onClickPrev, onClickNext,
    }: PropsWithChildren<IPropsRowSelector>
): JSX.Element => {

    // 
    const getStyle = () => {
        return cs + ' ' + s['row-selector'];
    }

    return (
        <div className={getStyle()}>
            <JustButton cs={s['action-button-left']} variant={IButtonVariant.outlineBlue}
                iconOffset={IIconOffset.xSmall} onClick={onClickPrev}
                icon={{
                    after: IconsEnum.utility_chevronleft,
                    position: IconPosition.afterToCenter,
                }}
            />

            <div>{children}</div>

            <JustButton cs={s['action-button-right']} variant={IButtonVariant.outlineBlue}
                iconOffset={IIconOffset.xSmall} onClick={onClickNext}
                icon={{
                    after: IconsEnum.utility_chevronright,
                    position: IconPosition.afterToCenter,
                }}
            />
        </div>
    );
}
