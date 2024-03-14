import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
// 

import { User } from './User';

//
@Table({ tableName: 'user_files' })
export class UserFile extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) url: string;
    @Column({}) title: string;
    @Column({}) user_id: number;
    @Column({ defaultValue: false }) is_loaded: boolean;

    // 
    @BelongsTo(() => User, 'user_id') user: User;
}
