import { BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
//
import { Product } from './Product';
import { WeaponShell } from './WeaponShell';
import { ProductWeapon } from './ProductWeapon';

//
@Table({ tableName: 'product_shells' })
export class ProductShell extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) product_id: number;

    //
    @BelongsTo(() => Product, 'product_id') product: Product;

    // 
    @HasMany(() => WeaponShell, 'shell_id') linkWeaponShell: WeaponShell[];
    @BelongsToMany(() => ProductWeapon, () => WeaponShell) weapons: ProductWeapon[];
}
