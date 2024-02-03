//
import s from './order.module.sass';
import { Order } from './types';



/**
 * Возвращает классы CSS для настройки порядка следования flex-элемента. \
 * Функция принимает значения для разных размеров экрана.
 */
const getOrder = (
    normalOrder: Order, smallOrder: Order,
    mediumOrder: Order, largeOrder: Order,
): string => {
    const customClass: string[] = [];
    if (normalOrder) customClass.push(s[`normal-order_${normalOrder}`]);
    if (smallOrder) customClass.push(s[`small-order_${smallOrder}`]);
    if (mediumOrder) customClass.push(s[`medium-order_${mediumOrder}`]);
    if (largeOrder) customClass.push(s[`large-order_${largeOrder}`]);
    return customClass.join(' ');
}
export default getOrder;
