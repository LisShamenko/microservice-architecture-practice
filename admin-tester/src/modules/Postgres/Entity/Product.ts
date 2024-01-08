import { BaseEntity, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
//
import { NullColumn } from '../decorators/NullColumn';
import { ProductTypes } from '../enums/ProductTypes';
import { InventoryProduct } from './InventoryProduct';
import { ProductCloth } from './ProductCloth';
import { ProductShell } from './ProductShell';
import { ProductSkill } from './ProductSkill';
import { ProductWeapon } from './ProductWeapon';
import { Requirement } from './Requirement';

//
@Entity('products')
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @NullColumn() public title: string;
    @Column() public price: number;
    @NullColumn({ default: 1 }) public max_in_slot: number;
    @NullColumn() requirement_id: number;
    @Column({
        type: 'enum',
        enum: ProductTypes,
        default: ProductTypes.none,
    })
    public product_type: ProductTypes;

    //
    @ManyToOne(() => Requirement, (requirement) => requirement.products)
    @JoinColumn({ name: 'requirement_id', referencedColumnName: 'id' })
    public requirement: Requirement;

    //
    @OneToOne(() => ProductCloth, (productCloth) => productCloth.product)
    public productCloth: ProductCloth;

    @OneToOne(() => ProductShell, (productShell) => productShell.product)
    public productShell: ProductShell;

    @OneToOne(() => ProductWeapon, (productWeapon) => productWeapon.product)
    public productWeapon: ProductWeapon;

    @OneToMany(() => ProductSkill, (productSkill) => productSkill.product)
    public skills: ProductSkill[];

    @OneToMany(() => InventoryProduct, (inventoryProduct) => inventoryProduct.product)
    public inventories: InventoryProduct[];
}
