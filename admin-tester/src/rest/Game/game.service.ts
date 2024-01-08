import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
//
import { InsertGameDto } from './dto/InsertGameDto';
import { UpdateGameDto } from './dto/UpdateGameDto';
import { Game } from 'src/modules/Postgres/entity/Game';
import { SpawnScript } from 'src/modules/Postgres/entity/SpawnScript';
import { GamePlayer } from 'src/modules/Postgres/entity/GamePlayer';
import { Map } from 'src/modules/Postgres/entity/Map';
import { Player } from 'src/modules/Postgres/entity/Player';
import { ErrorHelper } from '../services/ErrorHelper';

//
@Injectable()
export class GameService {
    constructor(
        @InjectDataSource('postgres_db') private dataSource: DataSource,
        private errorHelper: ErrorHelper,
    ) { }

    // 
    async insertGame(idto: InsertGameDto) {

        const map = await this.dataSource.getRepository(Map)
            .findOne({ where: { id: idto.map_id } });
        this.errorHelper.foundError(map, 'map_id');

        const script = await this.dataSource.getRepository(SpawnScript)
            .findOne({ where: { id: idto.spawn_script_id } });
        this.errorHelper.foundError(script, 'spawn_script_id');

        const player = await this.dataSource.getRepository(Player)
            .findOne({
                where: { id: idto.owner_player_id },
                relations: { game: true },
            });
        this.errorHelper.foundError(player, 'owner_player_id');
        if (player.game) {
            this.errorHelper.logicalError('the player has already created his own game');
        }

        // 
        const gamePlayer = new GamePlayer();
        gamePlayer.player_id = idto.owner_player_id;

        // 
        const game = new Game();
        game.map_id = idto.map_id;
        game.spawn_script_id = idto.spawn_script_id;
        game.owner_player_id = idto.owner_player_id;
        game.players = [gamePlayer];

        //
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(game);
            gamePlayer.game_id = game.id;
            await queryRunner.manager.save(gamePlayer);
            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.errorHelper.transactionError(err.message);
        }
        finally {
            await queryRunner.release();
        }
        return { id: game.id };
    }

    //
    async updateGame(game_id: number, udto: UpdateGameDto) {

        const game = await this.dataSource.getRepository(Game)
            .findOne({
                where: { id: game_id, players: true },
                relations: { players: true }
            });
        this.errorHelper.foundError(game, 'game_id');

        const player = await this.dataSource.getRepository(Player)
            .findOne({ where: { id: udto.player_id } });
        this.errorHelper.foundError(player, 'player_id');

        // 
        const ind = game.players.findIndex(p => p.player_id === udto.player_id);
        if (udto.to_connect) {
            if (ind >= 0) return '1';

            const gamePlayer = new GamePlayer();
            gamePlayer.game_id = game_id;
            gamePlayer.player_id = udto.player_id;
            const result = await this.dataSource.getRepository(GamePlayer)
                .insert(gamePlayer);

            return { insert_player: result.identifiers }
        }
        else {
            if (ind < 0) return '1';
            if (game.owner_player_id === udto.player_id) {
                this.errorHelper.logicalError('the owner cannot leave the game');
            }

            const result = await this.dataSource.getRepository(GamePlayer).delete({
                game_id: game_id,
                player_id: udto.player_id,
            })
            return { delete_player: result.affected };
        }
    }

    // 
    async deleteGame(game_id: number, owner_player_id: number) {
        try {
            const result = await this.dataSource.getRepository(Game)
                .delete({ id: game_id, owner_player_id: owner_player_id });
            return { rows: result.affected };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }

    // 
    async getOneGame(game_id: number) {
        const game = await this.dataSource.getRepository(Game)
            .findOne({
                where: { id: game_id },
                select: {
                    id: true,
                    map_id: true,
                    spawn_script_id: true,
                    players: {
                        game_id: true,
                        player_id: true,
                        player: {
                            id: true,
                            login: true,
                        }
                    }
                },
                relations: {
                    players: {
                        player: true
                    }
                },
            });
        this.errorHelper.foundError(game, 'game_id');

        return {
            id: game.id,
            map_id: game.map_id,
            spawn_script_id: game.spawn_script_id,
            players: game.players.map(p => ({
                id: p.player.id, login: p.player.login
            }))
        }
    }

    // 
    async getAllGames() {
        const games = await this.dataSource.getRepository(Game).find({
            select: {
                id: true,
                spawn_script_id: true,
                map_id: true,
                owner_player_id: true,
                map: {
                    title: true,
                },
                players: true,
                spawnScript: {
                    id: true,
                    enemies: {
                        script_id: true,
                        count: true
                    }
                }
            },
            relations: {
                map: true,
                players: true,
                spawnScript: {
                    enemies: true
                }
            },
        });

        return {
            games: (!games) ? [] : games.map(g => ({
                id: g.id,
                map_title: g.map.title,
                players_count: g.players.length,
                enemies_count: g.spawnScript.enemies
                    .reduce<number>((p, c) => p + c.count, 0),
            }))
        }
    }
}
