// 
import s from './table-head.module.sass';
import { a, px } from '../../../utils/styles';
import { MetaColumn, TableColumnHead } from '../Table.type';
import { ActionElement } from '../ActionElement/ActionElement';
import { DataElement } from '../DataElement/DataElement';
import { OffsetPadding } from '../DataElement/types';
import { ActionType } from '../ActionElement/types';



// 
interface IPropsTableHead {
    inds: number[],
    metaColumns: MetaColumn[],
    setDynamicItems: (colItem: MetaColumn) => void,
}

export const TableHead = (
    {
        inds, metaColumns, setDynamicItems,
    }: IPropsTableHead
): JSX.Element => {

    // 
    const getDataElement = (colIndex: number, head: TableColumnHead) => {
        const meta = head.metaData;
        const action = head.metaAction;

        let offset: OffsetPadding = OffsetPadding.empty;
        if (action && action.type && (
            action.type === ActionType.radio ||
            action.type === ActionType.button)) {
            offset = OffsetPadding.squareButton;
        }

        return (<>
            {meta && (
                <DataElement meta={meta} offsetPadding={offset}
                    rowPos={-1} cellPos={colIndex - Math.floor(inds.length / 2)}
                />
            )}
        </>);
    }

    const getActionElement = (colIndex: number, head: TableColumnHead) => {
        const action = head.metaAction;
        return (<>
            {action && (
                <ActionElement meta={action} rowPos={-1}
                    cellPos={colIndex - Math.floor(inds.length / 2)} />
            )}
        </>);
    }

    // 
    const getWidthStyle = (width?: number) => {
        return { width: width ? px(width) : 'auto' };
    }
    const getCellStyle = (colIndex: number) => {
        return s['fixed-cell'] + (colIndex === 0 ? (' ' + s['left-border']) : '');
    }

    return (
        <thead>
            <tr className={s['head-row']}>
                {inds.map((v, i) => {

                    const colIndex = inds.indexOf(i);
                    const colItem: MetaColumn = metaColumns[colIndex];
                    setDynamicItems(colItem);

                    return (colItem.width > 0) && (
                        <th key={i} className={a(s, 'cell', 'thead-th')}
                            style={getWidthStyle(colItem.width)}
                            scope="col" tabIndex={-1}
                        >
                            <div className={s['fixed-cell']} style={getWidthStyle(colItem.width)}>
                                {getDataElement(colIndex, colItem.head)}
                                {getActionElement(colIndex, colItem.head)}
                            </div>
                        </th>
                    )
                })}
            </tr>
        </thead>
    );
}
