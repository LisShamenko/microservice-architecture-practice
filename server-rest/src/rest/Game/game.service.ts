import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
//
import { InsertGameDto } from './dto/InsertGameDto';
import { UpdateGameDto } from './dto/UpdateGameDto';
import { Game, GameDocument } from '../../modules/Mongo/entity/Game';
import { SpawnScript, SpawnScriptDocument } from '../../modules/Mongo/entity/SpawnScript';
import { Map, MapDocument } from '../../modules/Mongo/entity/Map';
import { Player, PlayerDocument } from '../../modules/Mongo/entity/Player';
import { ErrorHelper } from '../services/ErrorHelper';
import { RedisRepository } from 'src/modules/RedisClient/redis.repository';
import { Prefix } from '../enums/prefix.enum';



//
@Injectable()
export class GameService {
    constructor(
        @InjectModel(Map.name, 'db')
        private mapModel: Model<MapDocument>,
        @InjectModel(SpawnScript.name, 'db')
        private spawnScriptModel: Model<SpawnScriptDocument>,
        @InjectModel(Player.name, 'db')
        private playerModel: Model<PlayerDocument>,
        @InjectModel(Game.name, 'db')
        private gameModel: Model<GameDocument>,
        private errorHelper: ErrorHelper,
        @Inject(RedisRepository)
        private repository: RedisRepository,
    ) { }

    // user, admin
    async insertGame(idto: InsertGameDto) {

        const map = await this.mapModel
            .where({ _id: idto.map_id })
            .findOne();
        this.errorHelper.foundError(map, 'map_id');

        const script = await this.spawnScriptModel
            .where({ _id: idto.spawn_script_id })
            .findOne();
        this.errorHelper.foundError(script, 'spawn_script_id');

        const player = await this.playerModel
            .where({ _id: idto.owner_player_id })
            .findOne();
        this.errorHelper.foundError(player, 'owner_player_id');

        if (player.owner_game_id) {
            this.errorHelper.logicalError('the player has already created his own game');
        }

        // 
        const game = {
            map_id: map._id,
            spawn_script_id: script._id,
            owner_player_id: player._id,
            players: [player.id],
        } as Game;

        //
        const newGame = new this.gameModel(game);
        const result = await newGame.save();

        player.owner_game_id = result._id;
        player.save();

        return { id: result.id };
    }

    // user, admin
    async updateGame(game_id: string, udto: UpdateGameDto) {

        const game = await this.gameModel
            .where({ _id: game_id })
            .findOne();
        this.errorHelper.foundError(game, 'game_id');

        const player = await this.playerModel
            .where({ _id: udto.player_id })
            .findOne();
        this.errorHelper.foundError(player, 'player_id');

        // 
        const ind = game.players.indexOf(udto.player_id);
        if (udto.to_connect) {
            if (ind >= 0) return '1';
            game.players.push(udto.player_id);
        }
        else {
            if (ind < 0) return '1';
            if (game.owner_player_id.toString() === udto.player_id) {
                this.errorHelper.logicalError('the owner cannot leave the game');
            }
            game.players.splice(ind, 1);
        }

        // 
        const result = await game.save();
        return { id: result.id };
    }

    // user, admin
    async deleteGame(game_id: string, owner_player_id: string) {
        try {
            const result = await this.gameModel.deleteOne({
                _id: game_id,
                owner_player_id: new Types.ObjectId(owner_player_id),
            });
            return { rows: result.deletedCount };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }

    // user, admin
    async getOneGame(game_id: string) {

        let result = await this.repository.getObject(Prefix.game, game_id);
        if (!result) {

            const game = await this.gameModel
                .where({ _id: new Types.ObjectId(game_id) })
                .populate(['game_map', 'game_script', 'game_owner'])
                .findOne();
            this.errorHelper.foundError(game, 'game_id');

            result = {
                id: game.id,
                map_id: game.map_id,
                spawn_script_id: game.spawn_script_id,
                players: game.players,
            }
            await this.repository.saveObject(Prefix.game, game.id, result);
        }
        return result;
    }

    // user, admin
    async getAllGames() {

        let result = await this.repository.getList(Prefix.game);
        if (!result) {

            const games = await this.gameModel
                .find()
                .populate(['game_map', 'game_script']);

            result = {
                games: (!games) ? [] : games.map(g => ({
                    id: g.id,
                    map_title: g.game_map[0].title,
                    players_count: g.players.length,
                    enemies_count: g.game_script[0].waves
                        .reduce<number>((p, c) => p + c.count, 0),
                }))
            }
            await this.repository.saveList(Prefix.game, result);
        }
        return result;
    }
}
