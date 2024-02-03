// 
import s from './table-body.module.sass';
import { a } from '../../../utils/styles';
import { ObjectLiteral, MetaColumn, TableColumnBody } from '../Table.type';
import { ActionElement } from '../ActionElement/ActionElement';
import { DataElement } from '../DataElement/DataElement';
import { OffsetPadding } from '../DataElement/types';
import { ActionType } from '../ActionElement/types';



// 
interface IPropsTableBody {
    inds: number[],
    metaColumns: MetaColumn[],
    data: ObjectLiteral[],
}

export const TableBody = (
    {
        inds, metaColumns, data,
    }: IPropsTableBody
): JSX.Element => {

    // 
    const getDataElement = (
        rowIndex: number, colIndex: number,
        body: TableColumnBody,
        value: string | number | boolean | undefined,
    ) => {
        const meta = body.getMetaData && body.getMetaData(rowIndex);
        const action = body.getMetaAction && body.getMetaAction(rowIndex);

        let offset: OffsetPadding = OffsetPadding.empty;
        if (action && action.type && (
            action.type === ActionType.radio ||
            action.type === ActionType.button)) {
            offset = OffsetPadding.squareButton;
        }

        return (<>
            {meta && (
                <DataElement value={value} meta={meta} offsetPadding={offset}
                    rowPos={rowIndex - Math.floor(data.length / 2)}
                    cellPos={colIndex - Math.floor(inds.length / 2)}
                />
            )}
        </>);
    }

    const getActionElement = (
        rowIndex: number, colIndex: number,
        body: TableColumnBody,
    ) => {
        const action = body.getMetaAction && body.getMetaAction(rowIndex);
        return (<>
            {action && (
                <ActionElement meta={action}
                    rowPos={rowIndex - Math.floor(data.length / 2)}
                    cellPos={colIndex - Math.floor(inds.length / 2)}
                />
            )}
        </>);
    }

    return (
        <tbody>
            {data && data.map((dataRow, rowIndex) => (
                <tr key={rowIndex} className={s['body-row']} tabIndex={-1}>
                    {inds.map((v, i) => {
                        const colIndex = inds.indexOf(i);
                        const colItem = metaColumns[colIndex];
                        return (colItem.width > 0) && (
                            <td key={colIndex} className={a(s, 'cell', 'tbody-td')}>
                                <div className={s['content-cell']}>
                                    {getDataElement(rowIndex, colIndex, colItem.body, dataRow[colItem.name])}
                                    {getActionElement(rowIndex, colIndex, colItem.body)}
                                </div>
                                <div className={s['border-divider']}></div>
                            </td>
                        )
                    })}
                </tr>
            ))}
        </tbody>
    );
}
