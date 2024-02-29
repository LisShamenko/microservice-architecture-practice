import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, model, models } from 'mongoose';
// 
import { Enemy } from './Enemy';



//
@Schema()
export class SpawnScriptEnemy {
    _id: Types.ObjectId;
    @Prop() count: number;
    @Prop() spawn_moment: number;
    @Prop({ type: Types.ObjectId, ref: 'Enemy' })
    enemy_id: Types.ObjectId;
    // 
    script_enemy: Enemy[];
}

export const SpawnScriptEnemySchema = SchemaFactory.createForClass(SpawnScriptEnemy);

SpawnScriptEnemySchema.virtual('script_enemy', {
    ref: 'Enemy', localField: 'enemy_id', foreignField: '_id',
})



// 
@Schema()
export class SpawnScript {
    _id: Types.ObjectId;
    @Prop() title: string;
    @Prop({ type: [SpawnScriptEnemySchema] })
    waves: SpawnScriptEnemy[];
}

export const SpawnScriptSchema = SchemaFactory.createForClass(SpawnScript);
export const SpawnScriptModel = models['SpawnScript'] || model<SpawnScript>(
    'SpawnScript', SpawnScriptSchema
);
export type SpawnScriptDocument = HydratedDocument<SpawnScript>;
