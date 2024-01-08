import { BaseEntity, Entity, OneToMany, OneToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
//
import { NullColumn } from '../decorators/NullColumn';
import { Enemy } from './Enemy';
import { Sorting } from '../enums/Sorting';
import { InventoryProduct } from './InventoryProduct';
import { LevelTemplate } from './LevelTemplate';
import { Player } from './Player';

//
@Entity('inventory')
export class Inventory extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @NullColumn({
        name: 'sorts',
        type: 'enum',
        enum: Sorting,
        default: Sorting.none,
    })
    sorting: Sorting;

    //
    @OneToOne(() => Enemy, (enemy) => enemy.inventory)
    public enemy: Enemy;

    @OneToOne(() => LevelTemplate, (levelTemplate) => levelTemplate.inventory)
    public levelTemplate: LevelTemplate;

    @OneToMany(() => InventoryProduct, (inventoryProduct) => inventoryProduct.inventory)
    public products: InventoryProduct[];

    @OneToOne(() => Player, (player) => player.inventory)
    public player: Player;
}
