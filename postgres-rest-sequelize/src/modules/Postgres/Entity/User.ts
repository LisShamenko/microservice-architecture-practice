import { Column, HasMany, Model, Table } from 'sequelize-typescript';
//
import { Photo } from './Photo';

@Table({ tableName: 'users' })
export class User extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column({})
    firstname: string;

    @Column({})
    lastname: string;

    @Column({ defaultValue: true })
    isActive: boolean;

    @HasMany(() => Photo)
    photos: Photo[];
}
