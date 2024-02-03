
/** Направление отступов. */
export enum Kit {
    /** Устанавливает значение `padding-top`. */
    top = 'top',
    /** Устанавливает значение `padding-right`. */
    right = 'right',
    /** Устанавливает значение `padding-bottom`. */
    bottom = 'bottom',
    /** Устанавливает значение `padding-left`. */
    left = 'left',
    /** Устанавливает значения `padding-right` и `padding-left`. */
    horizontal = 'horizontal',
    /** Устанавливает значения `padding-top` и `padding-bottom`. */
    vertical = 'vertical',
    /** Устанавливает все значения `padding`. */
    around = 'around',
}

/** Величина. */
export enum Magnitude {
    xxxSmall = 'xxx-small',
    xxSmall = 'xx-small',
    xSmall = 'x-small',
    small = 'small',
    medium = 'medium',
    large = 'large',
    xLarge = 'x-large',
    xxLarge = 'xx-large',
}

/**
 * Определяет ширину элемента.
 * - В процентах: `max_<*всего частей*>_size_<*сколько занимает*>`
 * - Константы: full, xxxSmall, xxSmall, xSmall, small, medium, large, xLarge, xxLarge.
 */
export const enum Size {
    // 
    none = 'none',
    full = 'full',
    xxxSmall = 'xxx-small',
    xxSmall = 'xx-small',
    xSmall = 'x-small',
    small = 'small',
    medium = 'medium',
    large = 'large',
    xLarge = 'x-large',
    xxLarge = 'xx-large',
    // 
    max_1_size_1 = '1-of-1',
    // 
    max_2_size_1 = '1-of-2',
    max_2_size_2 = '2-of-2',
    // 
    max_3_size_1 = '1-of-3',
    max_3_size_2 = '2-of-3',
    max_3_size_3 = '3-of-3',
    // 
    max_4_size_1 = '1-of-4',
    max_4_size_2 = '2-of-4',
    max_4_size_3 = '3-of-4',
    max_4_size_4 = '4-of-4',
    // 
    max_5_size_1 = '1-of-5',
    max_5_size_2 = '2-of-5',
    max_5_size_3 = '3-of-5',
    max_5_size_4 = '4-of-5',
    max_5_size_5 = '5-of-5',
    // 
    max_6_size_1 = '1-of-6',
    max_6_size_2 = '2-of-6',
    max_6_size_3 = '3-of-6',
    max_6_size_4 = '4-of-6',
    max_6_size_5 = '5-of-6',
    max_6_size_6 = '6-of-6',
    // 
    max_7_size_1 = '1-of-7',
    max_7_size_2 = '2-of-7',
    max_7_size_3 = '3-of-7',
    max_7_size_4 = '4-of-7',
    max_7_size_5 = '5-of-7',
    max_7_size_6 = '6-of-7',
    max_7_size_7 = '7-of-7',
    // 
    max_8_size_1 = '1-of-8',
    max_8_size_2 = '2-of-8',
    max_8_size_3 = '3-of-8',
    max_8_size_4 = '4-of-8',
    max_8_size_5 = '5-of-8',
    max_8_size_6 = '6-of-8',
    max_8_size_7 = '7-of-8',
    max_8_size_8 = '8-of-8',
    // 
    max_12_size_1 = '1-of-12',
    max_12_size_2 = '2-of-12',
    max_12_size_3 = '3-of-12',
    max_12_size_4 = '4-of-12',
    max_12_size_5 = '5-of-12',
    max_12_size_6 = '6-of-12',
    max_12_size_7 = '7-of-12',
    max_12_size_8 = '8-of-12',
    max_12_size_9 = '9-of-12',
    max_12_size_10 = '10-of-12',
    max_12_size_11 = '11-of-12',
    max_12_size_12 = '12-of-12',
}

/** Значение `order`. */
export enum Order {
    O1 = '1',
    O2 = '2',
    O3 = '3',
    O4 = '4',
    O5 = '5',
    O6 = '6',
    O7 = '7',
    O8 = '8',
    O9 = '9',
    O10 = '10',
    O11 = '11',
    O12 = '12',
}
