import { BaseEntity, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
//
import { Product } from './Product';
import { WeaponShell } from './WeaponShell';

//
@Entity('product_shells')
export class ProductShell extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column() product_id: number;

    //
    @OneToOne(() => Product, (product) => product.productShell)
    @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
    public product: Product;

    //
    @OneToMany(() => WeaponShell, (weaponShell) => weaponShell.productShell)
    public weapons: WeaponShell[];
}
