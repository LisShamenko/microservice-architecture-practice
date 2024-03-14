import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
//
import { TestModel } from './TestModel';
import { UserFile } from './UserFile';

//
@Table({ tableName: 'users' })
export class User extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) login: string;

    //
    @HasMany(() => TestModel, 'user_id') testModels: TestModel[];
    @HasMany(() => UserFile, 'user_id') userFiles: UserFile[];
}
