//
import s from './icon.module.sass';
import { IconsEnum, IconSize } from './types';



// 
interface IPropsIcon {
    cs?: string,
    icon: IconsEnum,
    size?: IconSize,
    isAbsolute?: boolean,
}

export const Icon = (
    {
        cs = '', icon,
        size = IconSize.medium,
        isAbsolute = false,
    }: IPropsIcon
): JSX.Element => {

    // 
    const getPath = () => {
        const family_name = icon.split(':');
        return `/svg/${family_name[0]}/symbols.svg#${family_name[1]}`;
    }

    // 
    const getStyle = () => {
        const customClass: string[] = [cs, s['icon']];
        if (size) customClass.push(s[`size-${size}`]);
        if (isAbsolute) {
            customClass.push(s['position-absolute']);
            customClass.push(s[`margin-top-${size}`]);
        }
        return customClass.join(' ');
    }

    return (
        <svg className={getStyle()}>
            <use xlinkHref={getPath()}></use>
        </svg>
    );
}
