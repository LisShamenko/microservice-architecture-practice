import { PropsWithChildren } from "react";
// 
import s from './child-icon.module.sass';
import { IconsEnum, IconSize } from "../Icon/types";
import { Icon } from "../Icon/Icon";
import { IconPosition } from "./types";



// 
export interface IPropsChildIcon {
    cs?: string,
    before?: IconsEnum,
    after?: IconsEnum,
    position?: IconPosition,
    size?: IconSize,
}

export const ChildIcon = (
    {
        children, cs = '', before, after,
        position = IconPosition.both,
        size = IconSize.xSmall,
    }: PropsWithChildren<IPropsChildIcon>
): JSX.Element => {

    // 
    const isIconBefore = (): boolean => {
        return (position === IconPosition.before || position === IconPosition.both);
    }
    const isIconAfter = (): boolean => {
        return (position === IconPosition.after || position === IconPosition.both);
    }
    const isChildren = (): boolean => {
        return (position !== IconPosition.beforeToCenter && position !== IconPosition.afterToCenter);
    }

    //
    const getStyle = () => {
        return cs + ' ' + s['child-icon'];
    }

    return (
        <div className={getStyle()}>
            {before && isIconBefore() && (
                <Icon cs={s['icon-before']} icon={before} size={size} />
            )}
            {before && (position === IconPosition.beforeToCenter) && (
                <Icon cs={s['icon-before-center']} icon={before} size={size} />
            )}
            {isChildren() && children}
            {after && isIconAfter() && (
                <Icon cs={s['icon-after']} icon={after} size={size} />
            )}
            {after && (position === IconPosition.afterToCenter) && (
                <Icon cs={s['icon-after-center']} icon={after} size={size} />
            )}
        </div>
    );
}
export { IconPosition };

