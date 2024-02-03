import s from './action-element.module.sass';
import { ButtonGroup, IButtonMenuParams, IGroupItem, IJustButtonParams } from '../../../layout/wrapper/ButtonGroup/ButtonGroup';
import { IPropsMenuItem } from '../../../layout/wrapper/ButtonMenu/MenuItem';
import { CircularMenu, ICircleMenuItem } from '../../../layout/wrapper/CircularMenu/CircularMenu';
import { JustButton } from '../../../interaction/button/JustButton/JustButton';
import { ButtonMenu } from '../../../layout/wrapper/ButtonMenu/ButtonMenu';
import { IButtonVariant, IIconOffset } from '../../../interaction/button/JustButton/types';
import { IconSize } from '../../../visualization/image/Icon/types';
import { Checkbox } from '../../../interaction/input/Checkbox/Checkbox';
import { CheckModeEnum } from '../../../interaction/input/Checkbox/types';
import { ButtonMenuAlignment } from '../../../layout/wrapper/DropdownLayout/types';
import { ActionType, IButton, ICheck, IGroup, IRadio, MetaAction } from './types';



// 
interface IPropsActionElement {
    meta: MetaAction,
    rowPos: number,
    cellPos: number,
}

export const ActionElement = (
    {
        meta, rowPos, cellPos
    }: IPropsActionElement
): JSX.Element => {

    // 
    const getCircleMenu = (menuItems?: ICircleMenuItem[]) => {
        return (menuItems && (
            <CircularMenu cs={s['cell-action']}>
                {menuItems}
            </CircularMenu>
        ));
    }

    const getAlign = (): ButtonMenuAlignment => {
        let align: ButtonMenuAlignment = ButtonMenuAlignment.topCenter;
        if (rowPos > 0) {
            if (cellPos > 0) align = ButtonMenuAlignment.topLeft;
            else align = ButtonMenuAlignment.topRight;
        }
        else {
            if (cellPos > 0) align = ButtonMenuAlignment.bottomLeft;
            else align = ButtonMenuAlignment.bottomRight;
        }
        return align;
    }

    const getMenu = (menuItems?: IPropsMenuItem[]) => {
        if (menuItems === undefined) return (<></>);
        return (menuItems && (
            <ButtonMenu cs={{ root: s['cell-action'] }}
                variant={IButtonVariant.base} alignment={getAlign()}
                iconSize={IconSize.xxSmall} iconOffset={IIconOffset.xxxSmall}>
                {menuItems}
            </ButtonMenu>
        ));
    }

    const getCheckbox = (action: ICheck | IRadio, mode: CheckModeEnum) => {
        return (
            <Checkbox cs={s['cell-action']} isMargin={false}
                mode={mode} name="check-294" value={action.value}
                isChecked={true} onChange={action.onClick}
            />
        );
    }

    const getButton = (action: IButton) => {
        return (
            <JustButton cs={s['button-in-cell']} variant={IButtonVariant.blue}
                onClick={action.onClick} title={action.title}
            />
        );
    }

    const getGroup = (action: IGroup) => {

        const items: IGroupItem[] = action.items.map((v, i) => {
            if (v.type === 'ButtonMenu') {
                const newMenu: IButtonMenuParams = { ...v, props: { ...v.props } };
                newMenu.props.alignment = getAlign();
                return newMenu;
            }
            const oldButton: IJustButtonParams = v;
            return oldButton;
        })

        return (
            <ButtonGroup cs={{ root: s['group-in-cell'], menu: s['group-in-cell'] }}>
                {items}
            </ButtonGroup>
        );
    }

    // 
    const getElement = () => {
        switch (meta.type) {
            case ActionType.circle: return getCircleMenu(meta.items);
            case ActionType.menu: return getMenu(meta.items);
            case ActionType.check: return getCheckbox(meta, CheckModeEnum.check);
            case ActionType.radio: return getCheckbox(meta, CheckModeEnum.radio);
            case ActionType.button: return getButton(meta);
            case ActionType.group: return getGroup(meta);
        }
    }

    return (<>
        {getElement()}
    </>);
}
