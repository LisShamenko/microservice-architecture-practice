import { useState } from 'react';
//
import s from './circular-menu.module.sass';
import { IconPosition } from '../../../visualization/image/ChildIcon/ChildIcon';
import { JustButton } from '../../../interaction/button/JustButton/JustButton';
import { IIconOffset, IButtonVariant } from '../../../interaction/button/JustButton/types';
import { IconsEnum, IconSize } from '../../../visualization/image/Icon/types';



// 
export interface ICircleMenuItem {
    icon?: IconsEnum,
    isSkip?: boolean,
    onClick?: () => void,
}



// 
interface IPropsCircularMenu {
    children: ICircleMenuItem[],
    cs?: string,
}

export const CircularMenu = (
    {
        children, cs = '',
    }: IPropsCircularMenu
): JSX.Element => {

    const [isOpen, setOpen] = useState(false);
    const onClick = () => {
        setOpen(!isOpen);
    }

    // 
    const plusDeltaProcent = 100;
    const getItems = () => (<>
        {children.map((item, i) => {
            if (item.isSkip) return (<></>);

            //
            const l = children.length;
            const a = -0.5 * Math.PI - 2 * (1 / l) * i * Math.PI;
            const left = (50 - plusDeltaProcent * Math.cos(a)).toFixed(4) + "%";
            const top = (50 + plusDeltaProcent * Math.sin(a)).toFixed(4) + "%";
            return (
                <JustButton key={i} cs={s['button'] + ' ' + s['menu-item']} style={{ left: left, top: top }}
                    iconOffset={IIconOffset.xSmall} variant={IButtonVariant.outlineBlue} onClick={item.onClick}
                    icon={{
                        after: item.icon,
                        position: IconPosition.afterToCenter,
                        size: IconSize.xSmall,
                    }}
                />
            );
        })}
    </>);

    // 
    const getStyle = () => {
        return cs + ' ' + s['circular-menu'];
    }

    return (
        <nav className={getStyle()}>
            <div className={s['hover-container']}>
                <div className={s['circle'] + (isOpen ? (' ' + s['open']) : '')}>
                    {getItems()}
                </div>
                <JustButton cs={s['button'] + ' ' + s['menu-button']}
                    iconOffset={IIconOffset.xxSmall}
                    variant={IButtonVariant.base} onClick={onClick}
                    icon={{
                        after: isOpen ? IconsEnum.utility_pinned : IconsEnum.utility_rows,
                        position: IconPosition.afterToCenter,
                        size: IconSize.xSmall,
                    }}
                />
            </div>
        </nav>
    );
}
