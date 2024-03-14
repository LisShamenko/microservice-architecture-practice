import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
//
import { ProductShell } from './ProductShell';
import { ProductWeapon } from './ProductWeapon';

//
@Table({ tableName: 'weapon_shells' })
export class WeaponShell extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @ForeignKey(() => ProductWeapon) @Column({}) weapon_id: number;
    @ForeignKey(() => ProductShell) @Column({}) shell_id: number;

    //  
    @BelongsTo(() => ProductWeapon, 'weapon_id') productWeapon: ProductWeapon;
    @BelongsTo(() => ProductShell, 'shell_id') productShell: ProductShell;
}
