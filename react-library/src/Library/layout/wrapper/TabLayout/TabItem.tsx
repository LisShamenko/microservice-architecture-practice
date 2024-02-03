import { useEffect, useRef } from "react";
// 
import s from './tab-layout.module.sass';
import { ITabOptions } from "./TabLayout";
import { JustButton } from "../../../interaction/button/JustButton/JustButton";
import { IButtonVariant, IButtonMode } from "../../../interaction/button/JustButton/types";



// 
interface IPropsTabItem {
    cs?: string,
    index: number,
    tabSetting: ITabOptions,
    isActive: boolean,
    onSetIndex: (index: number) => void | undefined,
    onSetWidth: (index: number, width: number) => void,
}

export const TabItem = (
    {
        cs = '',
        index, tabSetting, isActive = false,
        onSetIndex, onSetWidth,
    }: IPropsTabItem
): JSX.Element => {

    // 
    const itemRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (itemRef) {
            const width = itemRef.current?.offsetWidth;
            onSetWidth(index, width ? width : 0);
        }
    });

    // 
    const getStyle = () => {
        const customClass: string[] = [cs];
        if (isActive) customClass.push(s['is-active']);
        customClass.push(s['bar-item']);
        return customClass.join(' ');
    }

    return (
        <div ref={itemRef} className={getStyle()}>
            <JustButton cs={cs} variant={IButtonVariant.neutral} mode={IButtonMode.tabItem}
                //disabled={} accessKey={''} tabIndex={-1}
                onClick={() => onSetIndex(index)}
                title={tabSetting.title}
            />
        </div>
    );
}
