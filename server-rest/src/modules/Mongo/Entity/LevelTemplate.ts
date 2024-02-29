import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, model, models } from 'mongoose';
// 
import { PlayerProperty, PlayerPropertySchema } from './PlayerProperty';
import { Inventory, InventorySchema } from './Inventory';



//
@Schema()
export class LevelTemplate {
    _id: Types.ObjectId;
    @Prop() title: string;
    @Prop() coins: number;
    @Prop({ type: InventorySchema }) inventory: Inventory;
    @Prop({ type: PlayerPropertySchema }) properties: PlayerProperty;
    @Prop() skills: string[];
}

// 
export const LevelTemplateSchema = SchemaFactory.createForClass(LevelTemplate);
export const LevelTemplateModel = models['LevelTemplate'] || model<LevelTemplate>(
    'LevelTemplate', LevelTemplateSchema
);
export type LevelTemplateDocument = HydratedDocument<LevelTemplate>;
