import { BelongsTo, Column, DataType, Model, Table } from 'sequelize-typescript';
//
import { PropertyColumns } from '../enums/PropertyColumns';
import { Player } from './Player';

//
@Table({ tableName: 'level_effects' })
export class LevelEffect extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) count_matches: number;
    @Column({}) is_equipment: boolean;
    @Column({
        type: DataType.ENUM(...Object.values(PropertyColumns)),
        defaultValue: PropertyColumns.none,
    })
    property_column: PropertyColumns;
    @Column({}) delta_value: number;
    @Column({}) player_id: number;

    //
    @BelongsTo(() => Player, 'player_id') player: Player;
}
