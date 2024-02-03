import { ReactNode } from "react";
//
import s from "./accordion-layout.module.sass";
import { ButtonMenu, ISelectMenu } from "../ButtonMenu/ButtonMenu";
import { JustButton } from "../../../interaction/button/JustButton/JustButton";
import { IButtonVariant } from "../../../interaction/button/JustButton/types";
import { IconsEnum } from "../../../visualization/image/Icon/types";
import { ButtonMenuAlignment } from "../DropdownLayout/types";



// 
export interface IMenuItem {
    value: number,
    title: string,
}



// 
export interface IPropsAccordionItem {
    cs?: string,
    title: string,
    content: ReactNode,
    index: number,
    isOpen?: boolean | null,
    onClickTrigger: (index: number) => void,
    // 
    menuItems?: IMenuItem[],
    isShowMenu?: boolean,
    onSelectMenu?: (index: number, value: number) => void,
}

export const AccordionItem = (
    {
        cs = '', title, content, index,
        isOpen = null, onClickTrigger,
        menuItems, isShowMenu = false, onSelectMenu,
    }: IPropsAccordionItem
): JSX.Element => {

    // 
    const onClick = () => {
        onClickTrigger(index);
    }
    const onSelect: ISelectMenu = (value: number) => {
        if (onSelectMenu) onSelectMenu(index, value);
    }

    // 
    const getStyle = () => {
        return cs + ' ' + s['accordion-item'];
    }
    const getContentStyle = () => {
        const customClass: string[] = [cs, s['item-content']];
        if (isOpen) customClass.push(s['is-open']);
        return customClass.join(' ');
    }
    const getRightStyle = () => {
        const customClass: string[] = [cs, s['right-side']];
        if (isShowMenu && menuItems) customClass.push(s['is-show-menu']);
        return customClass.join(' ');
    }

    return (
        <div className={getStyle()}>
            <section>
                <div className={s['header-row']}>
                    <div className={s['left-side']}>
                        <JustButton variant={IButtonVariant.neutral} onClick={onClick}
                            icon={{ before: isOpen ? IconsEnum.utility_up : IconsEnum.utility_down }}
                            title={title}
                        />
                    </div>
                    <div className={getRightStyle()}>
                        <ButtonMenu variant={IButtonVariant.outlineBlue} onSelect={onSelect}
                            alignment={ButtonMenuAlignment.bottomLeft}>
                            {
                                menuItems
                                    ? menuItems.map(item => ({ variant: IButtonVariant.neutral, ...item }))
                                    : []
                            }
                        </ButtonMenu>
                    </div>
                </div>
                <div className={getContentStyle()}>
                    {content}
                </div>
            </section>
        </div>
    );
}
