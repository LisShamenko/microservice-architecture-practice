import { BaseEntity, Entity, OneToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
//
import { NullColumn } from '../decorators/NullColumn';
import { Product } from './Product';
import { Skill } from './Skill';

//
@Entity('requirements')
export class Requirement extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @NullColumn() title: string;
    @NullColumn() player_level: number;
    @NullColumn() strength: number;
    @NullColumn() endurance: number;
    @NullColumn() intelligence: number;
    @NullColumn() agility: number;
    @NullColumn() fire_weapons: number;
    @NullColumn() melee_weapons: number;
    @NullColumn() throwing: number;
    @NullColumn() doctor: number;
    @NullColumn() sneak: number;
    @NullColumn() steal: number;
    @NullColumn() traps: number;
    @NullColumn() science: number;
    @NullColumn() repair: number;
    @NullColumn() barter: number;

    //
    @OneToMany(() => Product, (product) => product.requirement)
    public products: Product[];

    @OneToMany(() => Skill, (skill) => skill.requirement)
    public skills: Skill[];
}
