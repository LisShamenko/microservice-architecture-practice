
/** Тип элемента данных. */
export enum DataType {
    label = "label",
    slider = "slider",
}

/** Полиморфный тип `Label`. */
export interface IMetaLabel {
    defValue?: string,
    type: DataType.label,
}

/** Полиморфный тип `Slider`. */
export interface IMetaSlider {
    //defValue: number,
    type: DataType.slider,
    min: number,
    max: number,
}

/** Полиморфный тип. */
export type MetaData = IMetaLabel | IMetaSlider;

/** Отступы для элемента данных. */
export enum OffsetPadding {
    /** Без отступов. */
    empty = "cell-label-only",
    /** Отступ при наличии кнопки меню справа. */
    squareButton = "cell-label-menu",
    /** Отступ при наличии обычной кнопки справа. */
    fullButton = "cell-label-button",
}
