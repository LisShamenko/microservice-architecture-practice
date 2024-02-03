import { useEffect, useState } from 'react';
//
import s from './dual-list.module.sass';
import { Label } from '../Label/Label';
import { OptionItem } from './OptionItem';
import { IconPosition } from '../../../visualization/image/ChildIcon/ChildIcon';
import { JustButton } from '../../button/JustButton/JustButton';
import { IButtonVariant } from '../../button/JustButton/types';
import { IconsEnum } from '../../../visualization/image/Icon/types';



// 
export interface IOptionItem {
    isSelected: boolean,
    label: string,
    value: string,
}



// 
interface IPropsDualList {
    cs?: string,
    name: string,
    label: string,
    initLeftList: IOptionItem[],
    initRightList: IOptionItem[],
    onChangeLists?: (left: IOptionItem[], right: IOptionItem[]) => void,
}

export const DualList = (
    {
        cs = '',
        name, label,
        initLeftList, initRightList, onChangeLists,
    }: IPropsDualList
): JSX.Element => {

    const [leftList, setLeftList] = useState<IOptionItem[]>(initLeftList);
    const [rightList, setRightList] = useState<IOptionItem[]>(initRightList);

    useEffect(() => {
        if (onChangeLists) onChangeLists(leftList, rightList);
    }, [leftList, rightList]);

    // 
    const getSelectItems = (list: IOptionItem[]) => {
        return list.reduce<{ result: IOptionItem[], rest: IOptionItem[] }>(
            (list, item) => {
                const newItem = { ...item, isSelected: false };
                if (item.isSelected) list.result = [...list.result, newItem];
                else list.rest = [...list.rest, newItem];
                return list;
            }, { result: [], rest: [] }
        );
    }

    const onClickLeft = () => {
        const list = getSelectItems(rightList);
        setLeftList([...leftList, ...list.result]);
        setRightList(list.rest);
    }

    const onClickRight = () => {
        const list = getSelectItems(leftList);
        setLeftList(list.rest);
        setRightList([...rightList, ...list.result]);
    }

    const onClickMix = () => {
        const left = getSelectItems(leftList);
        const rigth = getSelectItems(rightList);
        setLeftList([...left.rest, ...rigth.result]);
        setRightList([...rigth.rest, ...left.result]);
    }

    const listResetSelect = (list: IOptionItem[]) => {
        return list.reduce<IOptionItem[]>(
            (arr, item) => [...arr, { ...item, isSelected: false }], []
        );
    }

    const onClickReset = () => {
        setLeftList(listResetSelect(leftList));
        setRightList(listResetSelect(rightList));
    }

    // 
    const listNewSelect = (list: IOptionItem[], selectIndex: number) => {
        return list.reduce<IOptionItem[]>(
            (arr, item, index) => (index === selectIndex)
                ? [...arr, {
                    isSelected: !item.isSelected,
                    label: item.label,
                    value: item.value,
                }]
                : [...arr, item]
            , []
        );
    }

    const onSelectLeft = (selectIndex: number) => {
        setLeftList(listNewSelect(leftList, selectIndex));
    }

    const onSelectRight = (selectIndex: number) => {
        setRightList(listNewSelect(rightList, selectIndex));
    }

    // 
    const getStyle = () => {
        return cs + ' ' + s['dual-list'];
    }
    const getContainerStyle = () => {
        return s['dual-list-container'];
    }

    return (
        <div className={getStyle()}>
            {label && (
                <Label cs={s['main-label']} name={name} label={label} />
            )}
            <div className={getContainerStyle()}>
                <div className={s['list-options']}>
                    <span className={s['label']} id={`id_available_${name}`}>Available</span>
                    <div className={s['list-container']}>
                        <ul className={s['list']}>
                            {leftList && leftList.map((item, index) => (
                                <OptionItem key={index} cs={s['from-left']} index={index} label={item.label}
                                    onSelectOption={onSelectLeft}
                                    isSelected={item.isSelected} />
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={s['list-buttons']}>
                    <JustButton cs={s['button-item']} variant={IButtonVariant.base} onClick={onClickMix}
                        icon={{ after: IconsEnum.utility_diamond, position: IconPosition.afterToCenter }}
                    />
                    <JustButton cs={s['button-item']} variant={IButtonVariant.base} onClick={onClickLeft}
                        icon={{ after: IconsEnum.utility_left, position: IconPosition.afterToCenter }}
                    />
                    <JustButton cs={s['button-item']} variant={IButtonVariant.base} onClick={onClickRight}
                        icon={{ after: IconsEnum.utility_right, position: IconPosition.afterToCenter }}
                    />
                    <JustButton cs={s['button-item']} variant={IButtonVariant.base} onClick={onClickReset}
                        icon={{ after: IconsEnum.utility_clear, position: IconPosition.afterToCenter }}
                    />
                </div>

                <div className={s['list-options']}>
                    <span className={s['label']} id={`id_selected_${name}`}>Selected</span>
                    <div className={s['list-container']}>
                        <ul className={s['list']}>
                            {rightList && rightList.map((item, index) => (
                                <OptionItem key={index} cs={s['from-right']} index={index} label={item.label}
                                    onSelectOption={onSelectRight}
                                    isSelected={item.isSelected} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
