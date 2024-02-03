//
import s from './button-menu.module.sass';
import { IPropsChildIcon } from '../../../visualization/image/ChildIcon/ChildIcon';
import { IButtonVariant, IButtonMode } from '../../../interaction/button/JustButton/types';
import { JustButton } from '../../../interaction/button/JustButton/JustButton';



// 
export interface IPropsMenuItem {
    cs?: string,
    value: number,
    title: string,
    variant: IButtonVariant,
    icon?: IPropsChildIcon,
    accessKey?: string,
    tabIndex?: number,
    disabled?: boolean,
    onClick?: (value: number) => void | undefined,
}

export const MenuItem = (
    {
        cs = '',
        value, title, variant, icon,
        accessKey, tabIndex, disabled = false,
        onClick,
    }: IPropsMenuItem
): JSX.Element => {

    // 
    const onClickItem = () => {
        if (onClick) onClick(value);
    }

    return (
        <div className={s['menu-item']}>
            <JustButton cs={cs} variant={variant} onClick={onClickItem}
                disabled={disabled} accessKey={accessKey} tabIndex={tabIndex}
                mode={IButtonMode.listItem} icon={icon} title={title}
            />
        </div>
    );
}
