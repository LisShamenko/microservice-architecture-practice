import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
// 
import { Product } from './Product';
import { Skill } from './Skill';



//
@Table({ tableName: 'requirements' })
export class Requirement extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) title: string;
    @Column({}) player_level: number;
    @Column({}) strength: number;
    @Column({}) endurance: number;
    @Column({}) intelligence: number;
    @Column({}) agility: number;
    @Column({}) fire_weapons: number;
    @Column({}) melee_weapons: number;
    @Column({}) throwing: number;
    @Column({}) doctor: number;
    @Column({}) sneak: number;
    @Column({}) steal: number;
    @Column({}) traps: number;
    @Column({}) science: number;
    @Column({}) repair: number;
    @Column({}) barter: number;

    //
    @HasMany(() => Product, 'requirement_id') products: Product[];
    @HasMany(() => Skill, 'requirement_id') skills: Skill[];

    // 
    static properties: string[] = [
        'title', 'player_level', 'strength', 'endurance', 'intelligence', 'agility',
        'fire_weapons', 'melee_weapons', 'throwing', 'doctor', 'sneak', 'steal',
        'traps', 'science', 'repair', 'barter',
    ];
}
