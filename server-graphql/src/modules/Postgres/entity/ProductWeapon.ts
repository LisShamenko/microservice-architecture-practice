import { BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
//
import { Product } from './Product';
import { WeaponShell } from './WeaponShell';
import { ProductShell } from './ProductShell';

//
@Table({ tableName: 'product_weapons' })
export class ProductWeapon extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) product_id: number;

    //
    @BelongsTo(() => Product, 'product_id') product: Product;

    //
    @HasMany(() => WeaponShell, 'weapon_id') linkWeaponShell: WeaponShell[];
    @BelongsToMany(() => ProductShell, () => WeaponShell) shells: ProductShell[];
}
