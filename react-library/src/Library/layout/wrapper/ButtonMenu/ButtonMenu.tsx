//
import useOutsideClick from "../../../hooks/useOutsideClick";
import { JustButton } from "../../../interaction/button/JustButton/JustButton";
import { IButtonVariant, IIconOffset } from "../../../interaction/button/JustButton/types";
import { IconPosition } from "../../../visualization/image/ChildIcon/ChildIcon";
import { IconsEnum, IconSize } from "../../../visualization/image/Icon/types";
import { ButtonMenuAlignment, DropdownLayout } from "../DropdownLayout/DropdownLayout";
import { IPropsMenuItem, MenuItem } from "./MenuItem";



// 
export type ISelectMenu = (value: number, index: number) => void | undefined;

export type IDropdownMenu = (isDropdown: boolean) => void | undefined;



// 
export interface IPropsButtonMenu {
    cs?: {
        root?: string,
        button?: string,
    }
    variant: IButtonVariant,
    alignment?: ButtonMenuAlignment,
    iconNameOpen?: IconsEnum,
    iconNameClose?: IconsEnum,
    iconSize?: IconSize,
    iconOffset?: IIconOffset,
    isHideOnSelect?: boolean,
    onSelect?: ISelectMenu,
    onDropdownClick?: IDropdownMenu,
}

interface IProps extends IPropsButtonMenu {
    children: IPropsMenuItem[],
}

export const ButtonMenu = (
    {
        children, cs = { root: '', button: '' },
        variant, alignment = ButtonMenuAlignment.bottomCenter,
        iconNameOpen, iconNameClose, iconSize, iconOffset,
        isHideOnSelect = true, onSelect, onDropdownClick,
    }: IProps
): JSX.Element => {

    // 
    const [ref, isDropdown, setDropdown] = useOutsideClick(false);
    const onMenuClickHook = () => {
        if (onDropdownClick) onDropdownClick(!isDropdown);
        setDropdown(!isDropdown);
    }

    // 
    const onItemClickHook = (item: IPropsMenuItem, index: number) => (value: number) => {
        if (!item.disabled) {
            if (item.onClick) item.onClick(value);
            if (onSelect) onSelect(value, index);
            if (isHideOnSelect) setDropdown(false);
        }
    }

    //
    const getIconName = (): IconsEnum => {
        return isDropdown
            ? (iconNameOpen) ? iconNameOpen : IconsEnum.utility_chevrondown
            : (iconNameClose) ? iconNameClose : IconsEnum.utility_chevronup;
    }

    return (
        <DropdownLayout cs={cs.root}
            alignment={alignment}
            dropdown={[ref, isDropdown]}>
            {{
                trigger: (
                    <JustButton variant={variant} cs={cs.button}
                        iconOffset={iconOffset} onClick={onMenuClickHook}
                        icon={{
                            after: getIconName(),
                            position: IconPosition.afterToCenter,
                            size: iconSize,
                        }}
                    />
                ),
                panel: (<>
                    {children && children.map((item, index) => (
                        <MenuItem {...item} key={index}
                            onClick={onItemClickHook(item, index)}
                        />
                    ))}
                </>),
            }}
        </DropdownLayout >
    );
}
