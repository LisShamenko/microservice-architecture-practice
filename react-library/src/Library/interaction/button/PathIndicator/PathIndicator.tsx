import { useState } from 'react';
//
import s from './path-indicator.module.sass';
import { PathItem } from "./PathItem";
import { IStep } from './types';



// 
interface IPropsPathIndicator {
    children: IStep[],
    cs?: string,
    onSelect?: (index: number) => void
}

export const PathIndicator = (
    {
        children, cs = '', onSelect,
    }: IPropsPathIndicator
): JSX.Element => {

    // 
    const [flags, setFlags] = useState<boolean[]>(children.map(() => false));

    const selectStep = (item: IStep) => (index: number) => {
        if (item.onClick) item.onClick();
        setFlags(flags.map((v, i) => (index === i)));
        if (onSelect) onSelect(index);
    }

    // 
    const getStyle = () => {
        return cs + ' ' + s['path-indicator'];
    }

    return (
        <div className={getStyle()}>
            <div className={s['buttons-container']}>
                {children && children.map((item, index) => (
                    <PathItem key={index} index={index} {...item}
                        isActive={flags[index]} onClick={selectStep(item)}
                    />
                ))}
            </div>
        </div>
    );
}
