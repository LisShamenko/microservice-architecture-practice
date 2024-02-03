//
import s from './tag.module.sass';
import { IconPosition } from "../../image/ChildIcon/ChildIcon";
import { JustButton } from '../../../interaction/button/JustButton/JustButton';
import { IButtonVariant, IIconOffset } from '../../../interaction/button/JustButton/types';
import { TagVariant, TagMode } from './types';
import { IconsEnum, IconSize } from '../../image/Icon/types';
import { Icon } from '../../image/Icon/Icon';



// 
interface IParamsTagIcon {
    cs?: string,
    icon?: IconsEnum,
    size?: IconSize,
    isButton?: boolean,
    onClick?: () => void,
}



// 
interface IPropsTag {
    children: {
        before?: IParamsTagIcon,
        title: string,
        after?: IParamsTagIcon,
    },
    cs?: string,
    variant: TagVariant,
    mode?: TagMode,
}

export const Tag = (
    {
        children, cs = '',
        variant = TagVariant.neutral,
        mode = TagMode.custom,
    }: IPropsTag
): JSX.Element => {

    const { before, title, after } = children;

    // 
    const getSize = (size?: IconSize, defSize = IconSize.xSmall): IconSize => {
        return (size ? size : defSize);
    }

    const getIcon = (iconParams: IParamsTagIcon, style: string, icon?: IconsEnum) => iconParams.icon && (
        <Icon cs={s[style]} icon={icon ? icon : iconParams.icon} size={getSize(iconParams.size)} />
    );

    const getButton = (iconParams: IParamsTagIcon, style: string, icon?: IconsEnum) => (
        <JustButton variant={IButtonVariant.base} cs={`${iconParams?.cs} ${s[style]}`}
            iconOffset={IIconOffset.xxxSmall} onClick={iconParams?.onClick}
            icon={{
                before: (icon ? icon : iconParams.icon),
                position: IconPosition.beforeToCenter,
                size: getSize(iconParams.size, IconSize.xxSmall),
            }}
        />
    );

    const getBefore = () => {
        if (!before) return <></>;
        if (mode === TagMode.badge || mode === TagMode.pill) {
            return getIcon(before, 'icon-before');
        }
        else {
            if (before.isButton) return getButton(before, 'icon-before');
            else return getIcon(before, 'icon-before');
        }
    }

    const getAfter = () => {
        if (!after) return <></>;
        if (mode === TagMode.badge) {
            return getIcon(after, 'icon-after');
        }
        else if (mode === TagMode.pill) {
            return getButton(after, 'icon-after', IconsEnum.action_close);
        }
        else {
            if (after.isButton) return getButton(after, 'icon-after');
            else return getIcon(after, 'icon-after');
        }
    }

    // 
    const getStyle = () => {
        const customClass: string[] = [cs, s['tag'], s[`variant-${variant}`]];
        if (mode) customClass.push(s[mode]);
        return customClass.join(' ');
    }

    return (
        <div className={getStyle()}>
            {getBefore()}
            <div className={s['tag-text']}>
                {title}
            </div>
            {getAfter()}
        </div>
    );
}
