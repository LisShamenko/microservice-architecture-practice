import { BaseEntity, Column, Entity } from 'typeorm';
import { PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
//
import { Product } from './Product';
import { Skill } from './Skill';

//
@Entity('product_skills')
export class ProductSkill extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() product_id: number;
    @Column() skill_id: number;

    // 
    @ManyToOne(() => Product, (product) => product.skills)
    @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
    public product: Product;

    @ManyToOne(() => Skill, (skill) => skill.products)
    @JoinColumn({ name: 'skill_id', referencedColumnName: 'id' })
    public skill: Skill;
}
