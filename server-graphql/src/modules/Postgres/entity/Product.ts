import { BelongsTo, BelongsToMany, Column, DataType, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
//
import { ProductTypes } from '../enums/ProductTypes';
import { InventoryProduct } from './InventoryProduct';
import { ProductCloth } from './ProductCloth';
import { ProductShell } from './ProductShell';
import { ProductSkill } from './ProductSkill';
import { ProductWeapon } from './ProductWeapon';
import { Requirement } from './Requirement';
import { Skill } from './Skill';
import { Inventory } from './Inventory';

//
@Table({ tableName: 'products' })
export class Product extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) title: string;
    @Column({}) price: number;
    @Column({ defaultValue: 1 }) max_in_slot: number;
    @Column({}) requirement_id: number;
    @Column({
        type: DataType.ENUM(...Object.values(ProductTypes)),
        defaultValue: ProductTypes.none,
    })
    product_type: ProductTypes;

    //
    @BelongsTo(() => Requirement, 'requirement_id') requirement: Requirement;
    @HasOne(() => ProductCloth, 'product_id') productCloth: ProductCloth;
    @HasOne(() => ProductShell, 'product_id') productShell: ProductShell;
    @HasOne(() => ProductWeapon, 'product_id') productWeapon: ProductWeapon;

    // 
    @HasMany(() => ProductSkill, 'product_id') linkProductSkill: ProductSkill[];
    @BelongsToMany(() => Skill, () => ProductSkill) skills: Skill[];

    @HasMany(() => InventoryProduct, 'product_id') linkInventoryProduct: InventoryProduct[];
    @BelongsToMany(() => Inventory, () => InventoryProduct) inventories: Inventory[];
}
