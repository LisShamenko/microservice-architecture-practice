import { MouseEventHandler } from "react";
import { IconsEnum } from "../../../visualization/image/Icon/types";



/** Тип элемента ввода. */
export enum InputType {
    custom = 'custom',
    text = 'text',
    email = 'email',
    number = 'number',
    password = 'password',
    tel = 'tel',
    url = 'url',
    search = 'search',
    time = 'time',
    hidden = 'hidden',
}

/** Добавить кнопку/иконку в начало или конец элемента ввода. */
export interface ISideElement {
    icon: IconsEnum,
    isButton?: boolean,
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined,
}
