//
import s from './margin.module.sass';
import { Kit, Magnitude } from './types';



/** CSS-классы для настройки отступов `margin`. */
const getMargin = (kit: Kit, magnitude: Magnitude) => {
    return s[`m-${kit}_${magnitude}`];
}
export default getMargin;
