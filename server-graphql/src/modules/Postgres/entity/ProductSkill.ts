import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
//
import { Product } from './Product';
import { Skill } from './Skill';

//
@Table({ tableName: 'product_skills' })
export class ProductSkill extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @ForeignKey(() => Product) @Column({}) product_id: number;
    @ForeignKey(() => Skill) @Column({}) skill_id: number;

    //  
    @BelongsTo(() => Product, 'product_id') product: Product;
    @BelongsTo(() => Skill, 'skill_id') skill: Skill;
}
