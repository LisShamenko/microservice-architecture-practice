import { Column, ColumnOptions } from 'typeorm';

//
export function NullColumn(options?: ColumnOptions) {
    return Column({
        nullable: true,
        ...options,
    });
}
