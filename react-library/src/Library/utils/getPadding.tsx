//
import s from './padding.module.sass';
import { Kit, Magnitude } from './types';



/** CSS-классы для настройки отступов `padding`. */
const getPadding = (kit: Kit, magnitude: Magnitude) => {
    return s[`p-${kit}_${magnitude}`];
}
export default getPadding;
