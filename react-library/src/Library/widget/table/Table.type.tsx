// 
import { MetaAction } from "./ActionElement/types";
import { MetaData } from "./DataElement/types";
import { ColumnType } from "./DataTable/types";



/** Определяет ячейку в заголовке таблицы. */
export type TableColumnHead = {
    metaData?: MetaData,
    metaAction?: MetaAction,
}

/** Определяет ячейку в теле таблицы. */
export type TableColumnBody = {
    getMetaData?: (rowIndex: number) => MetaData,
    getMetaAction?: (rowIndex: number) => MetaAction,
}

/** Описание колонки. */
export type MetaColumn = {
    columnType: ColumnType,
    name: string,
    width: number,
    index: number,
    head: TableColumnHead,
    body: TableColumnBody,
}

/** Объектный литерал. */
export interface ObjectLiteral {
    [key: string]: string | number | boolean;
}
