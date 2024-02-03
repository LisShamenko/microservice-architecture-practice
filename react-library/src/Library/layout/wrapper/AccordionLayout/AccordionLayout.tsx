import { ReactNode, useState } from 'react';
//
import s from './accordion-layout.module.sass';
import { AccordionItem, IMenuItem } from './AccordionItem';



// 
export interface IAccordionItem {
    cs?: string,
    title: string,
    content: ReactNode,
    isHideItem?: boolean,
    menuItems?: IMenuItem[],
    isShowMenu?: boolean,
    onSelectMenu?: (index: number, value: number) => void,
}



// 
interface IPropsAccordionLayout {
    children: IAccordionItem[],
    cs?: string,
    multipleOpening?: boolean,
}

export const AccordionLayout = (
    {
        children, cs = '',
        multipleOpening = false,
    }: IPropsAccordionLayout
): JSX.Element => {

    // 
    const [openingFlags, setOpeningFlags] = useState<boolean[]>(
        Array.from({ length: children.length }, () => false)
    );
    //      useEffect(() => {
    //          setOpeningFlags(Array.from({ length: children.length }, () => false));
    //      }, children);

    const onClickTrigger = (index: number) => {
        let flags;
        if (multipleOpening) {
            flags = openingFlags.map((v, i) => (index === i) ? !v : v);
        }
        else {
            flags = openingFlags.map((v, i) => (index === i) ? !v : false);
        }
        setOpeningFlags(flags);
    }

    const getOpening = (index: number): boolean | null => {
        return openingFlags[index];
    }

    // 
    const getStyle = () => {
        return cs + ' ' + s['accordion-layout'];
    }

    return (
        <div className={getStyle()}>
            {children && children.reduce<ReactNode[]>(
                (arr, item, index) => item.isHideItem ? arr : [...arr, (
                    <AccordionItem key={index} index={index} {...item}
                        isOpen={getOpening(index)}
                        onClickTrigger={onClickTrigger}
                    />
                )], []
            )}
        </div>
    );
}
