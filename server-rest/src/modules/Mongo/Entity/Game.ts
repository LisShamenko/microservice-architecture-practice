import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, model, models } from 'mongoose';
// 
import { Map } from './Map';
import { SpawnScript } from './SpawnScript';
import { Player } from './Player';



//
@Schema()
export class Game {
    _id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Map.name })
    map_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: SpawnScript.name })
    spawn_script_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Player' })
    owner_player_id: Types.ObjectId;

    @Prop()
    players: string[];

    // 
    game_map: Map[];
    game_script: SpawnScript[];
    game_owner: Player[];
}

// 
export const GameSchema = SchemaFactory.createForClass(Game);

GameSchema.virtual('game_map', {
    ref: Map.name, localField: 'map_id', foreignField: '_id',
})
GameSchema.virtual('game_script', {
    ref: SpawnScript.name, localField: 'spawn_script_id', foreignField: '_id',
})
GameSchema.virtual('game_owner', {
    ref: 'Player', localField: 'owner_player_id', foreignField: '_id',
})

export const GameModel = models['Game'] || model<Game>('Game', GameSchema);
export type GameDocument = HydratedDocument<Game>;
