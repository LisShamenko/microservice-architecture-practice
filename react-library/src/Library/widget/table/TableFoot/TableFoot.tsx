// 
import { MetaColumn } from "../Table.type";



// 
interface IPropsTableFoot {
    metaColumns: MetaColumn[],
}

export const TableFoot = (
    {
        metaColumns,
    }: IPropsTableFoot,
): JSX.Element => {
    return (
        <tfoot>
            <tr>
                {/* 
                {columns && columns.map(item => (
                    <td>{item.label}</td>
                ))} 
                */}
            </tr>
        </tfoot>
    );
}
