import { useEffect, useState } from 'react';
// 
import st from './data-table.module.sass';
import { px } from '../../../utils/styles';
// 
import { TableHead } from '../TableHead/TableHead';
import { TableBody } from '../TableBody/TableBody';
import { TableFoot } from '../TableFoot/TableFoot';
import { ObjectLiteral, MetaColumn } from '../Table.type';
import { IPropsMenuItem } from '../../../layout/wrapper/ButtonMenu/MenuItem';
import { IGroupItem } from '../../../layout/wrapper/ButtonGroup/ButtonGroup';
import { ICircleMenuItem } from '../../../layout/wrapper/CircularMenu/CircularMenu';
import { PaginateElement } from '../PaginateElement/PaginateElement';
import { ColumnType, MoveDirection, SortDirection } from './types';
import { IconsEnum } from '../../../visualization/image/Icon/types';
import { DataType, MetaData } from '../DataElement/types';
import { ActionType } from '../ActionElement/types';



// 
export interface IButtonItem {
    title: string,
    onClick?: () => void,
}

export type DataTableColumn = {
    label?: string,
    name: string,
    width?: number,
    columnType: ColumnType,
    menu?: {
        items: IPropsMenuItem[],
        onClick: (itemIndex: number) => void,
    },
    buttons?: IButtonItem[],
    groupItems?: IGroupItem[],
}



// 
interface IPropsDataTable {
    cs?: string,
    fixedHeight?: number,
    columns: DataTableColumn[],
    initData: ObjectLiteral[],
    isFoot?: boolean,
}

export const DataTable = (
    {
        cs = '',
        fixedHeight, columns, initData,
        isFoot = false,
    }: IPropsDataTable
): JSX.Element => {

    //
    const [data, setData] = useState(initData);
    const [inds, setInds] = useState(Array.from(
        { length: columns.length }, (v, i) => i)
    );

    // 
    let menuCount = 0;
    const flagInds = columns.map((v, i) => (v.columnType === ColumnType.externalMenu) ? menuCount++ : -1);
    //const menuCount = columns.reduce((p, c, i) => (c.columnType === ColumnType.externalMenu) ? p + 1 : p, 0);
    const [flags, setFlags] = useState<boolean[][]>(columns.map((v, i) => {
        if (v.columnType === ColumnType.externalMenu) {
            return Array.from({ length: initData.length }, () => false);
        }
        return [];
    }));

    // 
    const [metaColumns, setMetaColumns] = useState<MetaColumn[]>([]);

    const initMetaColumns = (): MetaColumn[] => columns.map((colItem, colIndex) => {

        const result: MetaColumn = {
            columnType: colItem.columnType,
            name: colItem.name,
            index: colIndex,
            width: colItem.width ? colItem.width : 0,
            head: {
                metaData: undefined,
                metaAction: undefined,
            },
            body: {
                getMetaData: undefined,
                getMetaAction: undefined,
            },
        };

        switch (colItem.columnType) {
            case ColumnType.numbering:
                result.head.metaData = { type: DataType.label };
                result.body.getMetaData = (rowIndex: number): MetaData => ({
                    type: DataType.label,
                    defValue: `${rowIndex + 1}`,
                });
                break;
            case ColumnType.externalMenu:
                const items = colItem.menu ? colItem.menu.items : [];
                const onClickMenu = colItem.menu?.onClick;

                result.head.metaData = {
                    type: DataType.label,
                    defValue: colItem.label ? colItem.label : '',
                };

                result.head.metaAction = {
                    type: ActionType.menu,
                    items: items.map((menuItem, itemIndex) => ({
                        ...menuItem,
                        onClick: (value: number) => {
                            if (menuItem.onClick) menuItem.onClick(value);
                            if (onClickMenu) onClickMenu(itemIndex);
                        }
                    }))
                }

                //      result.body.getMetaAction = (rowIndex: number) => ({
                //          type: ActionType.check,
                //          onClick: () => {
                //              const flagIndex = flagInds[colIndex];
                //              //      const flag = flags[rowIndex][flagIndex];
                //              setFlags(flags.map((rv, ri) => (rowIndex === ri)
                //                  ? rv.map((cv, ci) => (flagIndex === ci) ? !cv : cv)
                //                  : rv
                //              ));
                //          }
                //      })

                break;
            case ColumnType.field:
            case ColumnType.id:
                result.head.metaData = {
                    type: DataType.label,
                    defValue: (colItem.label ? colItem.label : '') + result.index,
                };

                result.head.metaAction = {
                    type: ActionType.circle,
                    items: [],
                }

                result.body.getMetaData = (rowIndex: number): MetaData => ({ type: DataType.label });
                break;
            case ColumnType.update:
            case ColumnType.delete:
                const but: IButtonItem = colItem.buttons ? colItem.buttons[0] : { title: 'button' };

                result.head.metaData = {
                    type: DataType.label,
                    defValue: colItem.label ? colItem.label : '',
                };

                result.body.getMetaAction = (rowIndex: number) => ({
                    type: ActionType.button,
                    title: but.title,
                    onClick: but.onClick,
                });
                break;
            case ColumnType.all:
                const groupItems: IGroupItem[] = colItem.groupItems ? colItem.groupItems : [];

                result.head.metaData = {
                    type: DataType.label,
                    defValue: colItem.label ? colItem.label : 'Действия',
                };

                result.body.getMetaAction = (rowIndex: number) => ({
                    type: ActionType.group,
                    items: groupItems,
                });
                break;
        }

        //      export type ActionOfColumn = ICircle | IMenu | ICheck | IRadio | IButton;
        // 
        //      |              |   ЗАГОЛОВОК    |   ЯЧЕЙКИ       |        |                       |
        //      | ColumnType   | data  | action | data  | action | events | размещение            |
        //      |--------------|-------|--------|-------|--------|--------|-----------------------|
        //      | numbering    | нет   | нет    | index | нет    | нет    | вначале               |
        //      | externalMenu | +/-   | menu   | нет   | check  | *1     | вначале, после номера |
        //      ----------------------------------------------------------- до колонок данных -----
        //      | field        | label | circle | value | нет    |        |                       |
        //      | id           | label | circle | value | нет    |        |                       |
        //      | button       | label | circle | нет   | button | *2     |                       |
        //      ----------------------------------------------------------- после колонок данных --
        //      | update       | label | нет    | нет   | button | *3     | вконце                |
        //      | delete       | label | нет    | нет   | button | *4     | вконце, после update  |
        //      | all          | label | нет    | нет   | button | *3,*4  | вконце, исключает     |
        //      |                                                |        | update и delete       |
        //
        // *1 - несколько обработчиков для каждого поля меню, 
        //      обработчик на каждый check для установки флага
        //      const [flags] = useState(Array.from(data))
        // *2 - произвольный внешний обработчик, получает состояние data
        //      возвращает новое состояние
        // *3 - внешний обработчик, получает соответствующую строку данных
        // *4 - удалить строку + внешний обработчик оповещения, получает новое состояние data
        return result;
    });

    useEffect(() => {
        setMetaColumns(initMetaColumns());
    }, []);

    // 
    const initPage = 0;
    const countOnPage = 8;
    const [page, setPage] = useState(initPage);
    const getDataPage = (data: ObjectLiteral[], page: number) => {
        const startIndex = page * countOnPage;
        const count = Math.floor(initData.length / countOnPage);
        const endIndex = startIndex + ((page < count) ? countOnPage : (initData.length % countOnPage));
        return data.slice(startIndex, endIndex);
    }

    // 
    const [curDataPage, setCurDataPage] = useState<ObjectLiteral[]>(getDataPage(data, initPage));
    const onChangePage = (newPage: number) => {
        setPage(newPage);
        const newDataPage = getDataPage(data, newPage);
        setCurDataPage(newDataPage);
    }

    // 
    const onClickSort = (result: MetaColumn, direction: SortDirection) => {
        let sortData = [];
        if (direction === SortDirection.none) {
            sortData = initData.map(v => v);
        }
        else {
            sortData = initData.sort((aObj: ObjectLiteral, bObj: ObjectLiteral) => {
                let a = aObj[result.name], b = bObj[result.name];
                if (a === undefined || b === undefined || typeof a !== typeof b) {
                    return 0;
                }

                const dir = (direction === SortDirection.ascending) ? -1 : 1;
                if (typeof a === 'string' && typeof b === 'string') {
                    a = a.toUpperCase();
                    b = b.toUpperCase();
                }
                if (typeof a === typeof b) {
                    if (a < b) return dir;
                    if (a > b) return -dir;
                    return 0;
                }
                return 0;
            });
        }
        setData(sortData);
        const newDataPage = getDataPage(sortData, page);
        setCurDataPage(newDataPage);
    }
    const replaceInds = (result: MetaColumn, direction: MoveDirection) => {
        if (direction === MoveDirection.left && inds[result.index] <= 0) return;
        if (direction === MoveDirection.right && inds[result.index] >= metaColumns.length - 1) return;

        //
        const dir = (direction === MoveDirection.left) ? -1 : +1;
        const first = inds[result.index];
        const second = inds[result.index] + dir;
        const i = inds.indexOf(second);
        const newInds = inds.map(v => v);
        newInds[result.index] = second;
        newInds[i] = first;
        setInds(newInds);
    }
    const getCircleItems = (colItem: MetaColumn) => {
        const circleItems: ICircleMenuItem[] = [
            { isSkip: false, icon: IconsEnum.utility_arrow_top },
            { isSkip: false, icon: IconsEnum.utility_arrow_right },
            { isSkip: false, icon: IconsEnum.utility_arrow_bottom },
            { isSkip: false, icon: IconsEnum.utility_arrow_left },
        ];
        circleItems[0].onClick = () => onClickSort(colItem, SortDirection.ascending);
        circleItems[2].onClick = () => onClickSort(colItem, SortDirection.descending);
        circleItems[1].onClick = () => replaceInds(colItem, MoveDirection.right);
        circleItems[3].onClick = () => replaceInds(colItem, MoveDirection.left);
        return circleItems;
    }
    const setDynamicItems = (colItem: MetaColumn) => {

        if (colItem.head.metaAction && (
            colItem.columnType === ColumnType.field ||
            colItem.columnType === ColumnType.id
        )) {
            const metaAction = colItem.head.metaAction;
            if (metaAction.type === ActionType.circle) {
                metaAction.items = getCircleItems(colItem);
            }
        }

        if (colItem.columnType === ColumnType.externalMenu) {
            const flagIndex = flagInds[colItem.index];
            colItem.body.getMetaAction = (rowIndex: number) => ({
                type: ActionType.check,
                value: flags[flagIndex][rowIndex],
                onClick: () => {
                    console.log('--- flagIndex = ', flagIndex, ' --- rowIndex = ', rowIndex);
                    const newFlags = [...flags];
                    newFlags[flagIndex] = flags[flagIndex].map((v, i) => (rowIndex === i) ? !v : v);
                    setFlags(newFlags);
                }
            })
        }
    }

    // 
    const getStyle = () => {
        return cs ? cs + ' ' + st['data-table'] : st['data-table'];
    }
    const getFixedStyle = () => {
        return { height: fixedHeight ? px(fixedHeight) : 'auto' };
    }
    const getWidthStyle = () => {
        return { width: px(columns.reduce((p, c) => p + (c.width ? c.width : 0), 0)) };
    }

    return (
        <div className={getStyle()}>
            <div className={st['fixed-row']} style={getFixedStyle()}>
                <div className={st['row']}>
                    {(metaColumns.length > 0) && (
                        <table className={st['table']} style={getWidthStyle()}>
                            <TableHead inds={inds} metaColumns={metaColumns} setDynamicItems={setDynamicItems} />
                            <TableBody inds={inds} metaColumns={metaColumns} data={curDataPage} />
                            {isFoot && (<TableFoot metaColumns={metaColumns} />)}
                        </table>
                    )}
                </div>
            </div>
            <PaginateElement style={getWidthStyle()}
                initPage={initPage} countRows={initData.length} countOnPage={countOnPage}
                onPrev={onChangePage} onNext={onChangePage} onPage={onChangePage}
            />
        </div>
    );
}
