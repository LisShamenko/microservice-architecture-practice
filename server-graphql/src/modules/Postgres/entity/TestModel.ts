import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
// 

import { FileStatus } from '../enums/FileStatus';
import { User } from './User';
import { UserFile } from './UserFile';

//
@Table({ tableName: 'test_models' })
export class TestModel extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) title: string;
    @Column({}) description: string;
    @Column({}) photo_url: string;
    @Column({}) video_url: string;

    @Column({
        type: DataType.ARRAY(DataType.TEXT),
    }) notes: string[];

    @Column({
        type: DataType.ENUM(...Object.values(FileStatus)),
    }) status: FileStatus;
    
    @Column({}) user_id: number;
    @Column({}) file_id: number;

    // 
    @BelongsTo(() => User, 'user_id') user: User;
    @BelongsTo(() => UserFile, 'file_id') userFile: UserFile;
}
