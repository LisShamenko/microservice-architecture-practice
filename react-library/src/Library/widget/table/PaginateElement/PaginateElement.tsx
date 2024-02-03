import { CSSProperties, useState } from 'react';
// 
import s from './paginate-element.module.sass';
import { IconPosition } from '../../../visualization/image/ChildIcon/ChildIcon';
import { JustButton } from '../../../interaction/button/JustButton/JustButton';
import { IIconOffset, IButtonVariant } from '../../../interaction/button/JustButton/types';
import { IconsEnum, IconSize } from '../../../visualization/image/Icon/types';



// 
interface IPropsDataTable {
    cs?: string,
    style?: CSSProperties,
    // 
    initPage?: number,
    countRows: number,
    countOnPage: number,
    onPrev: (page: number) => void,
    onNext: (page: number) => void,
    onPage: (page: number) => void,
}

export const PaginateElement = (
    {
        cs = '', style,
        initPage = 0, countRows, countOnPage,
        onPrev, onNext, onPage,

    }: IPropsDataTable
): JSX.Element => {

    const countPages = Math.round(countRows / countOnPage);
    const [page, setPage] = useState(
        (initPage >= 0 && initPage < countPages) ? initPage : 0
    );

    const onClickPrev = () => {
        const newPage = page - 1;
        if (newPage < 0) return;
        setPage(newPage);
        onPrev(newPage);
    }
    const onClickNext = () => {
        const newPage = page + 1;
        if (newPage >= countPages) return;
        setPage(newPage);
        onNext(newPage);
    }
    const onClickPage = (newPage: number) => () => {
        setPage(newPage);
        onPage(newPage);
    }

    // 
    const getIcon = (iconName: IconsEnum) => {
        return {
            icon: {
                after: iconName,
                position: IconPosition.afterToCenter,
                size: IconSize.xSmall,
            }
        }
    }

    return (
        <div className={s['paginate-element']} style={style}>
            <JustButton cs={s['page-button']} onClick={onClickPrev}
                iconOffset={IIconOffset.xxSmall}
                variant={IButtonVariant.outlineBlue}
                {...getIcon(IconsEnum.utility_chevronleft)}
            />

            <div className={s['page-div']}></div>

            {Array.from({ length: countPages }).map((v, i) => (
                <div className={s['page-num-container']} key={i} >

                    {/* <a className={s['page-num']} onClick={onClickPage(i)}>{i + 1}</a> */}

                    <JustButton cs={s['page-num']} iconOffset={IIconOffset.xxSmall}
                        variant={IButtonVariant.base} onClick={onClickPage(i)}
                        title={`${i + 1}`}
                    />

                    {(i < countPages - 1) && (<div className={s['page-div']}></div>)}

                </div>))}

            <div className={s['page-div']}></div>

            <JustButton cs={s['page-button']} iconOffset={IIconOffset.xxSmall}
                variant={IButtonVariant.outlineBlue} onClick={onClickNext}
                {...getIcon(IconsEnum.utility_chevronright)}
            />
        </div>
    );
}
