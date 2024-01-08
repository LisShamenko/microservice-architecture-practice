import { BaseEntity, Column, Entity, OneToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
//
import { Photo } from './Photo';

// 
@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    firstname: string;
    @Column()
    lastname: string;
    @Column({ default: true })
    isActive: boolean;

    @OneToMany((type) => Photo, (photo) => photo.user)
    photos: Photo[];
}
