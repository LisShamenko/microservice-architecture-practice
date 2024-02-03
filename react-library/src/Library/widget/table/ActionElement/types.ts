import { MouseEventHandler } from "react";
// 
import { IGroupItem } from "../../../layout/wrapper/ButtonGroup/ButtonGroup";
import { IPropsMenuItem } from "../../../layout/wrapper/ButtonMenu/MenuItem";
import { ICircleMenuItem } from "../../../layout/wrapper/CircularMenu/CircularMenu";



/** Тип элемента действий. */
export enum ActionType {
    circle = "circle",
    menu = "menu",
    check = "check",
    radio = "radio",
    button = "button",
    group = "group",
}

/** Полиморфный тип `CircularMenu`. */
export interface ICircle {
    type: ActionType.circle,
    items: ICircleMenuItem[],
}

/** Полиморфный тип `ButtonMenu`. */
export interface IMenu {
    type: ActionType.menu,
    items: IPropsMenuItem[],
}

/** Полиморфный тип `Checkbox` в режиме флажка. */
export interface ICheck {
    type: ActionType.check,
    value: boolean,
    onClick: () => void,
}

/** Полиморфный тип `Checkbox` в режиме радио кнопки. */
export interface IRadio {
    type: ActionType.radio,
    value: boolean,
    onClick: () => void,
}

/** Полиморфный тип `JustButton`. */
export interface IButton {
    type: ActionType.button,
    title: string,
    onClick?: MouseEventHandler<HTMLButtonElement>,
}

/** Полиморфный тип `ButtonGroup`. */
export interface IGroup {
    type: ActionType.group,
    items: IGroupItem[],
}

/** Полиморфный тип. */
export type MetaAction = ICircle | IMenu | ICheck | IRadio | IButton | IGroup;
