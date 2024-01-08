import { BaseEntity, Column, Entity, OneToOne } from 'typeorm';
import { JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
//
import { Product } from './Product';

//
@Entity('product_clothes')
export class ProductCloth extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() product_id: number;

    //
    @OneToOne(() => Product, (product) => product.productCloth)
    @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
    public product: Product;
}
