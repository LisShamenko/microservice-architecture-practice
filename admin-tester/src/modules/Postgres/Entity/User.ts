import { BaseEntity, Column, Entity, OneToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
//
import { TestModel } from './TestModel';
import { UserFile } from './UserFile';

//
@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() login: string;

    //
    @OneToMany(() => TestModel, (testModel) => testModel.user)
    public testModels: TestModel[];

    @OneToMany(() => UserFile, (userFile) => userFile.user)
    public userFiles: UserFile[];
}
