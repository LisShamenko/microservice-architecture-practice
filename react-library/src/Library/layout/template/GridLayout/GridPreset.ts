import { ColumnRange, GridPreset, RowRange } from "./types";



// 
export interface IGridRange {
    column: ColumnRange,
    row: RowRange,
}

export const getGridRange = (preset: GridPreset): IGridRange => {

    if (preset.type === 'l3s4') {
        switch (preset.section) {
            case 'l3s4__header': return { column: ColumnRange.range_1_13, row: RowRange.range_1_2 };
            case 'l3s4__left-side': return { column: ColumnRange.range_1_4, row: RowRange.range_2_6 };
            case 'l3s4__content': return { column: ColumnRange.range_4_13, row: RowRange.range_2_6 };
            case 'l3s4__footer': return { column: ColumnRange.range_1_13, row: RowRange.range_6_7 };
        }
    }

    if (preset.type === 'header') {
        switch (preset.section) {
            case 'row-1-span-8': return { column: ColumnRange.range_1_9, row: RowRange.range_1_2 };
        }
    }

    return { column: ColumnRange.range_1_13, row: RowRange.range_1_2 };
}
