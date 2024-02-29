import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, model, models } from 'mongoose';
// 
import { Inventory } from './Inventory';
import { PlayerProperty } from './PlayerProperty';
import { PropertyColumns } from '../enums/PropertyColumns';
import { LevelTemplate } from './LevelTemplate';
import { Game } from './Game';



//
@Schema()
export class LevelEffect {
    _id: Types.ObjectId;
    @Prop() count_matches: number;
    @Prop() is_equipment: boolean;
    @Prop() property_column: PropertyColumns;
    @Prop() delta_value: number;
}

export const LevelEffectSchema = SchemaFactory.createForClass(LevelEffect);



// 
@Schema()
export class Player {
    _id: Types.ObjectId;
    @Prop() login: string;
    @Prop() password: string;
    @Prop() firstname: string;
    @Prop() secondname: string;
    @Prop() thirdname: string;
    @Prop() email: string;
    //
    @Prop() inventory: Inventory;
    @Prop() properties: PlayerProperty;
    @Prop({ type: Types.ObjectId, ref: LevelTemplate.name })
    level_template_id: Types.ObjectId;
    @Prop({ type: [LevelEffectSchema] })
    level_effects: LevelEffect[];
    @Prop() skills: string[];
    @Prop({ type: Types.ObjectId, ref: Game.name })
    owner_game_id: Types.ObjectId;
    // 
    player_level: LevelTemplate[];
}

// 
export const PlayerSchema = SchemaFactory.createForClass(Player);

PlayerSchema.virtual('player_level', {
    ref: LevelTemplate.name, localField: 'level_template_id', foreignField: '_id',
})
PlayerSchema.virtual('owner_game', {
    ref: Game.name, localField: 'owner_game_id', foreignField: '_id',
})

export const PlayerModel = models['Player'] || model<Player>('Player', PlayerSchema);
export type PlayerDocument = HydratedDocument<Player>;
