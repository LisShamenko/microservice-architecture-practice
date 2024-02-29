import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, model, models } from 'mongoose';
//
import { ProductTypes } from '../enums/ProductTypes';
import { Requirement } from './Requirement';



//
@Schema({ _id: false })
export class ProductCloth {
    @Prop({ type: Types.ObjectId, ref: 'Product' })
    product_id: Types.ObjectId;
    // 
    cloth_product: Product[];
}

export const ProductClothSchema = SchemaFactory.createForClass(ProductCloth);

ProductClothSchema.virtual('cloth_product', {
    ref: 'Product', localField: 'product_id', foreignField: '_id',
})



// 
@Schema({ _id: false })
export class ProductShell {
    @Prop({ type: Types.ObjectId, ref: 'Product' })
    product_id: Types.ObjectId;
    @Prop({ type: Types.Array }) weapons: string[];
    // 
    shell_product: Product[];
}

export const ProductShellSchema = SchemaFactory.createForClass(ProductShell);

ProductShellSchema.virtual('shell_product', {
    ref: 'Product', localField: 'product_id', foreignField: '_id',
})



//
@Schema({ _id: false })
export class ProductWeapon {
    @Prop({ type: Types.ObjectId, ref: 'Product' })
    product_id: Types.ObjectId;
    @Prop({ type: Types.Array }) shells: string[];
    // 
    weapon_product: Product[];
}

export const ProductWeaponSchema = SchemaFactory.createForClass(ProductWeapon);

ProductWeaponSchema.virtual('weapon_product', {
    ref: 'Product', localField: 'product_id', foreignField: '_id',
})



// 
@Schema()
export class Product {
    _id: Types.ObjectId;
    @Prop() title: string;
    @Prop() price: number;
    @Prop() max_in_slot: number;
    @Prop() requirements: Requirement;
    @Prop() skills: string[];
    // 
    @Prop() product_type: ProductTypes;
    @Prop({ type: ProductClothSchema }) cloth: ProductCloth | null;
    @Prop({ type: ProductShellSchema }) shell: ProductShell | null;
    @Prop({ type: ProductWeaponSchema }) weapon: ProductWeapon | null;
}

// 
export const ProductSchema = SchemaFactory.createForClass(Product);
export const ProductModel = models['Product'] || model<Product>(
    'Product', ProductSchema
);
export type ProductDocument = HydratedDocument<Product>;
