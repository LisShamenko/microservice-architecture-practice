import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
//
import { Enemy } from './Enemy';
import { Sorting } from '../enums/Sorting';
import { InventoryProduct } from './InventoryProduct';
import { LevelTemplate } from './LevelTemplate';
import { Player } from './Player';
import { Product } from './Product';



//
@Table({ tableName: 'inventory' })
export class Inventory extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({
        field: 'sorts',
        type: DataType.ENUM(...Object.values(Sorting)),
        defaultValue: Sorting.none,
    })
    sorting: Sorting;

    //
    @HasOne(() => Enemy, 'inventory_id') enemy: Enemy;
    @HasOne(() => LevelTemplate, 'inventory_id') levelTemplate: LevelTemplate;
    @HasOne(() => Player, 'inventory_id') player: Player;

    // 
    @HasMany(() => InventoryProduct, 'inventory_id') linkInventoryProduct: InventoryProduct[];
    @BelongsToMany(() => Product, () => InventoryProduct) products: Product[];
}
