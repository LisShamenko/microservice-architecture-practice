import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
// 
import { Sorting } from '../enums/Sorting';
import { Product } from './Product';



//
@Schema({ _id: false })
export class InventoryProduct {
    @Prop({ type: Types.ObjectId, ref: Product.name })
    product_id: Types.ObjectId;
    @Prop() count_in_all_slots: number;
    // 
    products: Product[];
}

export const InventoryProductSchema = SchemaFactory.createForClass(InventoryProduct);

InventoryProductSchema.virtual('products', {
    ref: Product.name,
    localField: 'product_id',
    foreignField: '_id',
})



// 
@Schema({ _id: false })
export class Inventory {
    @Prop() sorting: Sorting;
    @Prop({ type: [InventoryProductSchema] })
    products: InventoryProduct[];
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
