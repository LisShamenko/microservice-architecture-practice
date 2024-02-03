
/** Определяет цвет кнопки. */
export enum IButtonVariant {
    base = 'base',
    neutral = 'neutral',
    blue = 'blue',
    outlineBlue = 'outline-blue',
    red = 'red',
    outlineRed = 'outline-red',
    green = 'green',
    outlineGreen = 'outline-green',
}

/** Количество дополнительного пространства вокруг значка. */
export enum IIconOffset {
    xxxSmall = 'p-icon-xxx_small',
    xxSmall = 'p-icon-xx_small',
    xSmall = 'p-icon-x_small',
    small = 'p-icon-small',
    medium = 'p-icon-medium',
    large = 'p-icon-large',
    xLarge = 'p-icon-x_large',
    xxLarge = 'p-icon-xx_large',
}

/** Режим встраивания в родительский компонент. */
export enum IButtonMode {
    /** Кнопка помещается в список меню. */
    listItem = 'list-item',
    /** Кнопка помещается на панель. */
    tabItem = 'tab-item',
}
