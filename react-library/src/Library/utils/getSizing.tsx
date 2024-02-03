//
import s from './get-sizing.module.sass';
import { Size } from './types';



/** CSS-классы для настройки ширины элемента. */
const getSizing = (
    normalSize?: Size, smallSize?: Size,
    mediumSize?: Size, largeSize?: Size,
) => {
    const customClass: string[] = [];
    if (normalSize) customClass.push(s[`normal-size_${normalSize}`]);
    if (smallSize) customClass.push(s[`small-size_${smallSize}`]);
    if (mediumSize) customClass.push(s[`medium-size_${mediumSize}`]);
    if (largeSize) customClass.push(s[`large-size_${largeSize}`]);
    return customClass.join(' ');
}
export default getSizing;
