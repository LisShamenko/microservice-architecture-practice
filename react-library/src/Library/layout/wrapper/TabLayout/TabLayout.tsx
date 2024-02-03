import { ReactNode, useEffect, useRef, useState } from "react";
// 
import s from './tab-layout.module.sass';
import { TabItem } from "./TabItem";
import useResizeTimeout from "../../../hooks/useResizeTimeout";
import { ButtonMenu } from "../ButtonMenu/ButtonMenu";
import { ButtonMenuAlignment } from "../DropdownLayout/DropdownLayout";
import { IButtonVariant, IIconOffset } from "../../../interaction/button/JustButton/types";
import { IconSize } from "../../../visualization/image/Icon/types";



// 
export interface ITabOptions {
    cs?: string,
    title: string,
}

export interface IContentOptions {
    cs?: string,
    content: ReactNode,
}



// 
interface IPropsTabLayout {
    children: {
        cs?: {
            container?: string,
            bar?: string,
            barItem?: string,
            menuItem?: string,
            barActiveItem?: string,
            contentItem?: string,
        },
        tabs: ITabOptions[],
        contents: IContentOptions[],
    },
}

export const TabLayout = (
    { children }: IPropsTabLayout
): JSX.Element => {

    // 
    const {
        cs = {
            container: '', bar: '', barItem: '',
            menuItem: '', barActiveItem: '', contentItem: '',
        },
        tabs,
        contents = [],
    } = children;

    //
    const [activeIndex, setActiveIndex] = useState(contents.length > 0 ? 0 : -1);
    const onSetTabIndex = (index: number) => setActiveIndex(index);
    const onClickMenuItem = (index: number) => setActiveIndex(index);

    // 
    const [drawTabs, setDrawTabs] = useState(tabs);
    const [drawMenu, setDrawMenu] = useState<ITabOptions[]>([]);
    const [isShowButtonMenu, setShowButtonMenu] = useState(false);
    const firstRef = useRef<HTMLDivElement>(null);
    const widths = useRef(Array.from({ length: tabs.length }, (v, i) => 0));
    const msUpdate = 250;
    let isDrawing = false;

    const setNewTabs = (length: number) => {
        setDrawTabs(Array.from<ITabOptions, ITabOptions>(
            { length: length }, (v, i) => tabs[i]
        ));

        setDrawMenu(Array.from<ITabOptions, ITabOptions>(
            { length: tabs.length - length }, (v, i) => tabs[i + length]
        ));

        setShowButtonMenu(length < tabs.length);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (isDrawing) {
                isDrawing = false;

                const firstWidth = firstRef?.current?.offsetWidth;
                if (firstWidth && tabs.length > 0) {

                    if (firstWidth <= widths.current[0]) {
                        setNewTabs(0);
                    }
                    else if (firstWidth >= widths.current[tabs.length - 1]) {
                        setNewTabs(tabs.length);
                    }
                    else {
                        for (let i = 1; i < widths.current.length; i++) {
                            if (firstWidth <= widths.current[i]) {
                                setNewTabs(i);
                                break;
                            }
                        }
                    }
                }
            }
        }, msUpdate);

        return () => clearInterval(interval);
    }, []);

    useResizeTimeout(msUpdate, () => {
        isDrawing = true;
    });

    const onSetWidth = (index: number, width: number) => {
        if (index === 0) {
            isDrawing = false;
        }
        // TODO: пересчёт массива widths
        widths.current[index] = width + ((index <= 0) ? 0 : widths.current[index - 1]);
        if (index === tabs.length - 1) {
            isDrawing = true;
        }
    }

    //
    const getContainerStyle = () => {
        return cs.container + ' ' + s['tab-layout'];
    }
    const getBarStyle = () => {
        return cs.bar + ' ' + s['tab-bar'];
    }
    const getMenuItemStyle = () => {
        const customClass: string[] = [];
        if (cs.menuItem) customClass.push(cs.menuItem);
        customClass.push(s['menu-item']);
        customClass.push(isShowButtonMenu ? s['menu-visible'] : s['menu-hidden']);
        if (activeIndex >= drawTabs.length) customClass.push(s['is-active']);
        return customClass.join(' ');
    }
    const getContentItemStyle = () => {
        return cs.contentItem + ' ' + s['content-item'];
    }

    return (
        <div className={getContainerStyle()}>
            <div className={getBarStyle()}>
                <div className={s['menu-container']} ref={firstRef}>
                    {drawTabs && drawTabs.map((item: ITabOptions, index: number) => (
                        <TabItem key={index} cs={cs.barItem}
                            index={index} isActive={(index === activeIndex)} tabSetting={item}
                            onSetIndex={onSetTabIndex} onSetWidth={onSetWidth}
                        />
                    ))}
                </div>
                <div className={getMenuItemStyle()}>
                    {drawMenu && (
                        <ButtonMenu cs={{ root: s['menu-icon'] }} variant={IButtonVariant.outlineBlue}
                            //isHideOnSelect={false}
                            onSelect={(v, i) => console.log(v, '-', i)}
                            iconSize={IconSize.xxSmall} iconOffset={IIconOffset.xxxSmall}
                            alignment={ButtonMenuAlignment.bottomLeft}>
                            {
                                drawMenu.map((item: ITabOptions, index: number) => ({
                                    cs: (index + drawTabs.length === activeIndex) ? s['item-active'] : '',
                                    variant: IButtonVariant.neutral,
                                    value: index + drawTabs.length,
                                    title: item.title,
                                    onClick: onClickMenuItem,
                                }))
                            }
                        </ButtonMenu>
                    )}
                </div>
            </div>
            <div className={getContentItemStyle()}>
                {(contents && activeIndex >= 0 && activeIndex < contents.length)
                    ? (contents[activeIndex].content)
                    : (<div></div>)
                }
            </div>
        </div>
    );
}
