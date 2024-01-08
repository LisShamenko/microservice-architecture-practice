import { BaseEntity, Column, Entity } from 'typeorm';
import { PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
//
import { NullColumn } from '../decorators/NullColumn';
import { Inventory } from './Inventory';
import { Product } from './Product';

//
@Entity('inventory_products')
export class InventoryProduct extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @NullColumn() public count_in_all_slots: number;
    @Column() inventory_id: number;
    @Column() product_id: number;

    //
    @ManyToOne(() => Inventory, (inventory) => inventory.products)
    @JoinColumn({ name: 'inventory_id', referencedColumnName: 'id' })
    public inventory: Inventory;

    @ManyToOne(() => Product, (product) => product.inventories)
    @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
    public product: Product;
}
