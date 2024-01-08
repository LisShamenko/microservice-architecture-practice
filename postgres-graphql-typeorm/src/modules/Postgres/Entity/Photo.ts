import {
    BaseEntity,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
//
import { User } from './User';

@Entity('photos')
export class Photo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.photos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user' })
    user: User;
}
