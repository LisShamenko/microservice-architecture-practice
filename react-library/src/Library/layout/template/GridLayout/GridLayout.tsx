//
import s from './grid-layout.module.sass';
import { GapSpace, GridAlign, CellAlign } from './types';
import { GridCell, IPropsGridCell } from "./GridCell";



// 
interface IPropsGridLayout {
    children: IPropsGridCell[],
    cs?: string,
    freeSpace?: GapSpace,
    gridHorAlign?: GridAlign,
    gridVerAlign?: GridAlign,
    cellsHorAlign?: CellAlign,
    cellsVerAlign?: CellAlign,
}

export const GridLayout = (
    {
        children, cs = '',
        freeSpace,
        gridHorAlign, gridVerAlign, cellsHorAlign, cellsVerAlign,
    }: IPropsGridLayout
): JSX.Element => {

    const getStyle = () => {
        const customClass: string[] = [cs, s['grid-layout']];
        if (freeSpace) customClass.push(s['grid-space-' + freeSpace]);
        if (gridHorAlign) customClass.push(s['grid-hor-' + gridHorAlign]);
        if (gridVerAlign) customClass.push(s['grid-ver-' + gridVerAlign]);
        if (cellsHorAlign) customClass.push(s['all-cells-hor-' + cellsHorAlign]);
        if (cellsVerAlign) customClass.push(s['all-cells-ver-' + cellsVerAlign]);
        return customClass.join(' ');
    }

    return (
        <div className={getStyle()}>
            {children && children.map((item, index) => {
                return (<GridCell key={index} {...item} />);
            })}
        </div>
    );
}
