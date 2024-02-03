//
import s from './path-indicator.module.sass';
import { Icon } from '../../../visualization/image/Icon/Icon';
import { IconsEnum, IconSize } from '../../../visualization/image/Icon/types';
import { PathType } from './types';



// 
interface IPropsPathItem {
    cs?: string,
    pathType: PathType,
    isActive: boolean,
    title: string,
    index: number,
    onClick?: (index: number) => void,
}

export const PathItem = (
    {
        cs = '',
        pathType, isActive, title, index,
        onClick,
    }: IPropsPathItem
): JSX.Element => {

    //
    const onClickItem = (e: any) => {
        if (onClick) onClick(index);
    }

    // 
    const getStyle = () => {
        const customClass: string[] = [cs, s['path-item']];
        customClass.push(isActive ? s['state-active'] : s['state-' + pathType]);
        return customClass.join(' ');
    }

    return (
        <div className={getStyle()}>
            <a className={s['path-link']} tabIndex={0} onClick={onClickItem}>
                <span className={s['path-stage']}>
                    <Icon icon={IconsEnum.utility_check} size={IconSize.small} />
                </span>
                <span className={s['path-title']}>
                    {title}
                </span>
            </a>
        </div>
    );
}
