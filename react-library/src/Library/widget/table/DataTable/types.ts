
/** Направление сортировки. */
export enum SortDirection {
    none = "none",
    ascending = "ascending",
    descending = "descending",
}

/** Направление перемещения ячейки. */
export enum MoveDirection {
    left = "left",
    right = "right",
}

/** Тип колонки. */
export enum ColumnType {
    /** 0. Идентификация. */
    id = "id",
    /** 1. Нумерация строк. */
    numbering = "numbering",
    /** 2. Обычное поле, меню с сортировкой и перемещением. */
    field = "field",
    /** 3. Флажок выбора строки. */
    externalMenu = "externalMenu",
    /** 4. Кнопки операций CRUD. */
    all = "all",
    update = "update",
    delete = "delete",
}
