import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
//
import { Photo } from './Photo';

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

//      export const UserSchema = new EntitySchema<User>({
//          name: 'testers',
//          target: User,
//          columns: {
//              id: { type: Number, primary: true, generated: true },
//              firstname: { type: String },
//              lastname: { type: String },
//              isActive: { type: Boolean, default: true },
//          },
//          relations: {
//              photos: {
//                  type: 'one-to-many',
//                  target: 'Photo',
//              },
//          },
//      });
