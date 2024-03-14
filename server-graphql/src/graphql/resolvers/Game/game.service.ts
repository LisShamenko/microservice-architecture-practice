import { Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { PaginatorArgs } from 'nestjs-graphql-tools';
// 
import { Game } from '../../../modules/Postgres/entity/Game';
import { SpawnScript } from '../../../modules/Postgres/entity/SpawnScript';
import { Map } from '../../../modules/Postgres/entity/Map';
import { Player } from '../../../modules/Postgres/entity/Player';
import { GamePlayer } from '../../../modules/Postgres/entity/GamePlayer';
import { ErrorHelper } from '../services/ErrorHelper';
import { GameObject, NewGameInput, UpdateGameInput, UpdateGameOutput, UpdateGameResult } from './game.objects';



// 
@Injectable()
export class GameService {
    private repoMap: Repository<Map>;
    private repoSpawnScript: Repository<SpawnScript>;
    private repoPlayer: Repository<Player>;
    private repoGame: Repository<Game>;
    private repoGamePlayer: Repository<GamePlayer>;


    constructor(
        private sequelize: Sequelize,
        private errorHelper: ErrorHelper,
    ) {
        this.repoMap = this.sequelize.getRepository(Map);
        this.repoSpawnScript = this.sequelize.getRepository(SpawnScript);
        this.repoPlayer = this.sequelize.getRepository(Player);
        this.repoGame = this.sequelize.getRepository(Game);
        this.repoGamePlayer = this.sequelize.getRepository(GamePlayer);
    }

    // 
    async insertGame(idto: NewGameInput) {

        const map = await this.repoMap.findOne({
            where: { id: idto.map_id }
        });
        this.errorHelper.foundError(map, 'map_id');

        const script = await this.repoSpawnScript.findOne({
            where: { id: idto.spawn_script_id }
        });
        this.errorHelper.foundError(script, 'spawn_script_id');

        const player = await this.repoPlayer.findOne({
            where: { id: idto.owner_player_id },
            include: ['game'],
        });
        this.errorHelper.foundError(player, 'owner_player_id');

        if (player.game) {
            this.errorHelper.logicalError('the player has already created his own game');
        }

        // 
        const gamePlayer = new GamePlayer();
        gamePlayer.player_id = idto.owner_player_id;

        const game = new Game();
        game.map_id = idto.map_id;
        game.spawn_script_id = idto.spawn_script_id;
        game.owner_player_id = idto.owner_player_id;

        // 
        const t = await this.sequelize.transaction();
        try {
            await game.save({ transaction: t });
            gamePlayer.game_id = game.id;
            await gamePlayer.save({ transaction: t });
            await t.commit();
            return game;
        }
        catch (err) {
            await t.rollback();
            this.errorHelper.transactionError(err.message);
        }
    }

    async updateGame(udto: UpdateGameInput) {

        const game = await this.repoGame.findOne({
            where: { id: udto.game_id },
            include: ['linkGamePlayer'],
        });
        this.errorHelper.foundError(game, 'game_id');

        const player = await this.repoPlayer.findOne({
            where: { id: udto.player_id }
        });
        this.errorHelper.foundError(player, 'player_id');

        // 
        const output = new UpdateGameOutput();
        const ind = game.linkGamePlayer.findIndex(p => p.player_id === udto.player_id);
        if (udto.to_connect) {
            if (ind >= 0) return output.setResult(UpdateGameResult.alreadyInserted);

            await this.repoGamePlayer.create({
                game_id: udto.game_id,
                player_id: udto.player_id,
            });
            return output.setResult(UpdateGameResult.inserted);
        }
        else {
            if (ind < 0) return output.setResult(UpdateGameResult.alreadyDeleted);
            if (game.owner_player_id === udto.player_id) {
                this.errorHelper.logicalError('the owner cannot leave the game');
            }

            await this.repoGamePlayer.destroy({
                where: {
                    game_id: udto.game_id,
                    player_id: udto.player_id,
                },
                force: true,
            })

            return output.setResult(UpdateGameResult.deleted);
        }
    }

    async getOneGame(game_id: number): Promise<GameObject> {
        return await this.repoGame.findOne({ where: { id: game_id } });
    }

    async getAllGames(paginator: PaginatorArgs): Promise<GameObject[]> {
        if (paginator) {
            return await this.repoGame.findAll({
                offset: paginator.page * paginator.per_page,
                limit: paginator.per_page,
            });
        }
        return await this.repoGame.findAll();
    }

    async deleteGame(game_id: number) {
        try {
            const result = await this.repoGame.destroy({
                where: { id: game_id },
                force: true,
            });
            return { rows: result };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }
}
