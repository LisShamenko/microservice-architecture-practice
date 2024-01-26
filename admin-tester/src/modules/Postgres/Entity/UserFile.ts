import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
// 
import { NullColumn } from '../decorators/NullColumn';
import { User } from './User';

//
@Entity('user_files')
export class UserFile extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() url: string;
    @NullColumn() title: string;
    @Column() user_id: number;
    @NullColumn({ default: false }) is_loaded: boolean;

    // 
    @ManyToOne(() => User, (user) => user.userFiles)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    public user: User;
}
