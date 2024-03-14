import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
//

import { Inventory } from './Inventory';
import { Product } from './Product';

//
@Table({ tableName: 'inventory_products' })
export class InventoryProduct extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) count_in_all_slots: number;
    @ForeignKey(() => Inventory) @Column({}) inventory_id: number;
    @ForeignKey(() => Product) @Column({}) product_id: number;

    //
    @BelongsTo(() => Inventory, 'inventory_id') inventory: Inventory;
    @BelongsTo(() => Product, 'product_id') product: Product;
}
