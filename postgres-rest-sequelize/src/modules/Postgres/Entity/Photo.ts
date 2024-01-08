import {
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
//
import { User } from './User';

@Table({ tableName: 'photos' })
export class Photo extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @ForeignKey(() => User)
    user: number;

    @BelongsTo(() => User)
    users: User;
}
