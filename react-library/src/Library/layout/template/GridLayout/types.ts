
/**
 * Содержит список именованных областей для сетки CSS.
 * ___
 * Типы шаблонов:
 * ___
 *  - **l3s4** - Три уровня (layers : 3) и четыре секции (sections : 4).
 *      - *l3s4__header* - Область заголовка.
 *      - *l3s4__left-side* - Область левого меню.
 *      - *l3s4__content* - Область контента.
 *      - *l3s4__footer* - Область подвала.
 * ___
 *  - **header** - Область заголовка страницы.
 *      - *'row-1-span-8'* - Заголовок на первой строке, на всю длину сетки.
 */
export type GridPreset = {
    type: 'none',
    section: 'none',
} | {
    type: 'l3s4',
    section: 'l3s4__header' | 'l3s4__left-side' | 'l3s4__content' | 'l3s4__footer',
} | {
    type: 'header',
    section: 'row-1-span-8',
};

/** Свободное пространство между ячейками. */
export enum GapSpace {
    none = 'none',
    xxxSmall = 'xxx-small',
    xxSmall = 'xx-small',
    xSmall = 'x-small',
    small = 'small',
    medium = 'medium',
    large = 'large',
    xLarge = 'x-large',
    xxLarge = 'xx-large',
}

/** Вырванивание содержимого таблицы. */
export enum GridAlign {
    start = 'start',
    end = 'end',
    center = 'center',
    stretch = 'stretch',
    spaceAround = 'space-around',
    spaceBetween = 'space-between',
    spaceEvenly = 'space-evenly',
}

/** Выравнивание содержимого ячейки. */
export enum CellAlign {
    start = 'start',
    end = 'end',
    center = 'center',
    stretch = 'stretch',
}

/**
 * Указывает сколько `строк` будет занимать ячейка сетки. \
 * Управляет значением CSS-свойства `grid-row`. \
 * Формат: `range_<`*начальная строка*`>_<`*до этой строкой*`>`
 */
export enum RowRange {
    range_1_2 = 'row-range-1-2',
    range_1_3 = 'row-range-1-3',
    range_1_4 = 'row-range-1-4',
    range_1_5 = 'row-range-1-5',
    range_1_6 = 'row-range-1-6',
    range_1_7 = 'row-range-1-7',
    range_2_3 = 'row-range-2-3',
    range_2_4 = 'row-range-2-4',
    range_2_5 = 'row-range-2-5',
    range_2_6 = 'row-range-2-6',
    range_2_7 = 'row-range-2-7',
    range_3_4 = 'row-range-3-4',
    range_3_5 = 'row-range-3-5',
    range_3_6 = 'row-range-3-6',
    range_3_7 = 'row-range-3-7',
    range_4_5 = 'row-range-4-5',
    range_4_6 = 'row-range-4-6',
    range_4_7 = 'row-range-4-7',
    range_5_6 = 'row-range-5-6',
    range_5_7 = 'row-range-5-7',
    range_6_7 = 'row-range-6-7',
}

/**
 * Указывает сколько `столбцов` будет занимать ячейка сетки. \
 * Управляет значением CSS-свойства `grid-column`. \
 * Формат: `range_<`*начальная колонка*`>_<`*до этой колонки*`>`
 */
export enum ColumnRange {
    range_1_2 = 'column-range-1-2',
    range_1_3 = 'column-range-1-3',
    range_1_4 = 'column-range-1-4',
    range_1_5 = 'column-range-1-5',
    range_1_6 = 'column-range-1-6',
    range_1_7 = 'column-range-1-7',
    range_1_8 = 'column-range-1-8',
    range_1_9 = 'column-range-1-9',
    range_1_10 = 'column-range-1-10',
    range_1_11 = 'column-range-1-11',
    range_1_12 = 'column-range-1-12',
    range_1_13 = 'column-range-1-13',
    range_2_3 = 'column-range-2-3',
    range_2_4 = 'column-range-2-4',
    range_2_5 = 'column-range-2-5',
    range_2_6 = 'column-range-2-6',
    range_2_7 = 'column-range-2-7',
    range_2_8 = 'column-range-2-8',
    range_2_9 = 'column-range-2-9',
    range_2_10 = 'column-range-2-10',
    range_2_11 = 'column-range-2-11',
    range_2_12 = 'column-range-2-12',
    range_2_13 = 'column-range-2-13',
    range_3_4 = 'column-range-3-4',
    range_3_5 = 'column-range-3-5',
    range_3_6 = 'column-range-3-6',
    range_3_7 = 'column-range-3-7',
    range_3_8 = 'column-range-3-8',
    range_3_9 = 'column-range-3-9',
    range_3_10 = 'column-range-3-10',
    range_3_11 = 'column-range-3-11',
    range_3_12 = 'column-range-3-12',
    range_3_13 = 'column-range-3-13',
    range_4_5 = 'column-range-4-5',
    range_4_6 = 'column-range-4-6',
    range_4_7 = 'column-range-4-7',
    range_4_8 = 'column-range-4-8',
    range_4_9 = 'column-range-4-9',
    range_4_10 = 'column-range-4-10',
    range_4_11 = 'column-range-4-11',
    range_4_12 = 'column-range-4-12',
    range_4_13 = 'column-range-4-13',
    range_5_6 = 'column-range-5-6',
    range_5_7 = 'column-range-5-7',
    range_5_8 = 'column-range-5-8',
    range_5_9 = 'column-range-5-9',
    range_5_10 = 'column-range-5-10',
    range_5_11 = 'column-range-5-11',
    range_5_12 = 'column-range-5-12',
    range_5_13 = 'column-range-5-13',
    range_6_7 = 'column-range-6-7',
    range_6_8 = 'column-range-6-8',
    range_6_9 = 'column-range-6-9',
    range_6_10 = 'column-range-6-10',
    range_6_11 = 'column-range-6-11',
    range_6_12 = 'column-range-6-12',
    range_6_13 = 'column-range-6-13',
    range_7_8 = 'column-range-7-8',
    range_7_9 = 'column-range-7-9',
    range_7_10 = 'column-range-7-10',
    range_7_11 = 'column-range-7-11',
    range_7_12 = 'column-range-7-12',
    range_7_13 = 'column-range-7-13',
    range_8_9 = 'column-range-8-9',
    range_8_10 = 'column-range-8-10',
    range_8_11 = 'column-range-8-11',
    range_8_12 = 'column-range-8-12',
    range_8_13 = 'column-range-8-13',
    range_9_10 = 'column-range-9-10',
    range_9_11 = 'column-range-9-11',
    range_9_12 = 'column-range-9-12',
    range_9_13 = 'column-range-9-13',
    range_10_11 = 'column-range-10-11',
    range_10_12 = 'column-range-10-12',
    range_10_13 = 'column-range-10-13',
    range_11_12 = 'column-range-11-12',
    range_11_13 = 'column-range-11-13',
    range_12_13 = 'column-range-12-13',
}
