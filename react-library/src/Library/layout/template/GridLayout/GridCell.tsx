import { ReactNode } from "react";
//
import s from './grid-layout.module.sass';
import { CellAlign, ColumnRange, GridPreset, RowRange } from "./types";
import { getGridRange } from "./GridPreset";



// 
export interface IPropsGridCell {
    cs?: string,
    content: ReactNode,
    column?: ColumnRange,
    row?: RowRange,
    preset?: GridPreset,
    cellHorAlign?: CellAlign,
    cellVerAlign?: CellAlign,
}

export const GridCell = (
    {
        cs = '', content,
        column, row, preset,
        cellHorAlign, cellVerAlign,
    }: IPropsGridCell
): JSX.Element => {

    const getStyle = () => {
        const customClass: string[] = [cs];

        if (preset) {
            const gridRange = getGridRange(preset);
            if (column) customClass.push(s[column]);
            else customClass.push(s[gridRange.column]);
            if (row) customClass.push(s[row]);
            else customClass.push(s[gridRange.row]);
        }
        else {
            if (column) customClass.push(s[column]);
            if (row) customClass.push(s[row]);
        }

        if (cellHorAlign) customClass.push(s['cell-hor-' + cellHorAlign]);
        if (cellVerAlign) customClass.push(s['cell-ver-' + cellVerAlign]);
        return customClass.join(' ');
    }

    return (
        <div className={getStyle()}>
            {content}
        </div>
    );
}
