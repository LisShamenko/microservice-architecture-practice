import { BaseEntity, Column, Entity } from 'typeorm';
import { PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
//
import { ProductShell } from './ProductShell';
import { ProductWeapon } from './ProductWeapon';

//
@Entity('weapon_shells')
export class WeaponShell extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() weapon_id: number;
    @Column() shell_id: number;

    // 
    @ManyToOne(() => ProductWeapon, (productWeapon) => productWeapon.shells)
    @JoinColumn({ name: 'weapon_id', referencedColumnName: 'id' })
    public productWeapon: ProductWeapon;

    @ManyToOne(() => ProductShell, (productShell) => productShell.weapons)
    @JoinColumn({ name: 'shell_id', referencedColumnName: 'id' })
    public productShell: ProductShell;
}
