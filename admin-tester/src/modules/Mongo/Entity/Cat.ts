import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, model } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
    @Prop()
    name: string;
    @Prop()
    age: number;
}

export const CatSchema = SchemaFactory.createForClass(Cat);

export const CatModel = model<Cat>('Cat', CatSchema);
