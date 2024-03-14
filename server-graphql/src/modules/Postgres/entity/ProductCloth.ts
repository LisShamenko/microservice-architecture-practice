import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
//
import { Product } from './Product';

//
@Table({ tableName: 'product_clothes' })
export class ProductCloth extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) product_id: number;
    //
    @BelongsTo(() => Product, 'product_id') product: Product;
}
