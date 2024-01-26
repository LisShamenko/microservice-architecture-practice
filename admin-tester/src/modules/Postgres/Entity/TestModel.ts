import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
// 
import { NullColumn } from '../decorators/NullColumn';
import { FileStatus } from '../enums/FileStatus';
import { User } from './User';
import { UserFile } from './UserFile';

//
@Entity('test_models')
export class TestModel extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() title: string;
    @NullColumn() description: string;
    @NullColumn() photo_url: string;
    @NullColumn() video_url: string;
    @Column('text', { array: true }) notes: string[];
    @Column({ type: 'enum', enum: FileStatus }) status: FileStatus;
    @Column() user_id: number;
    @Column() file_id: number;

    // 
    @ManyToOne(() => User, (user) => user.testModels)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    public user: User;

    @OneToOne(() => UserFile)
    @JoinColumn({ name: 'file_id', referencedColumnName: 'id' })
    public userFile: UserFile;
}
