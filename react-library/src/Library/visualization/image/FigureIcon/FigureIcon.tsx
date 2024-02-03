// 
import s from './figure-icon.module.sass';
import { IconsEnum, IconSize } from '../Icon/types';
import { Icon } from '../Icon/Icon';
import { IFigureColor, IFigureBorder } from './types';



// 
export interface IChildrenFigureIcon {
    icon: {
        name: IconsEnum,
        size?: IconSize,
    },
    background?: {
        color?: IFigureColor,
        border?: IFigureBorder,
        size?: IconSize,
    },
}



// 
export interface IPropsFigureIcon {
    cs?: string,
    caption?: string,
}

interface IProps extends IPropsFigureIcon {
    children: IChildrenFigureIcon,
}

export const FigureIcon = (
    {
        children, cs = '',
        caption,
    }: IProps
): JSX.Element => {

    //
    const { icon, background } = children;

    // 
    const getStyle = () => {
        return `${cs} ${s['figure-icon']}`;
    }
    const getBackgroundStyle = () => {
        const customClass: string[] = [cs, s['icon-container']];
        if (background) {
            if (background.color) customClass.push(s[`color-${background.color}`]);
            if (background.border) customClass.push(s[`border-${background.border}`]);
            if (background.size) customClass.push(s[`size-${background.size}`]);
        }
        return customClass.join(' ');
    }

    return (
        <figure className={getStyle()}>
            <div className={getBackgroundStyle()}>
                <Icon icon={icon.name} size={icon.size} />
            </div>
            {caption && (
                <figcaption className={s['icon-caption']}>
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}
