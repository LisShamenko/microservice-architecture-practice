import { Args, Int, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
// 
import { GraphqlLoader, Loader, LoaderData, Paginator, PaginatorArgs } from 'nestjs-graphql-tools';
import { GameObject, NewGameInput, UpdateGameInput, UpdateGameOutput } from './game.objects';
import { GameService } from './game.service';
import { GraphQLService } from '../graphql.service';
import { MapObject } from '../Map/map.objects';
import { SpawnScriptObject } from '../Spawn/spawn.objects';
import { PlayerObject } from '../Player/player.objects';
import { DeleteResult } from '../graphql.objects';



// 
@Resolver(() => GameObject)
export class GameResolver {
    constructor(
        private readonly gameService: GameService,
        private readonly graphQLService: GraphQLService,
    ) { }

    // fields

    @ResolveField(() => [MapObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.map_id })
    async map(@Loader({}) loader: LoaderData<MapObject, number>) {
        const result = await this.graphQLService.findMap(loader.ids);
        return await loader.helpers.mapOneToManyRelation(result, loader.ids, 'id');
    }

    @ResolveField(() => [SpawnScriptObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.spawn_script_id })
    async spawnScript(@Loader({}) loader: LoaderData<SpawnScriptObject, number>) {
        const result = await this.graphQLService.findSpawnScript(loader.ids);
        return await loader.helpers.mapOneToManyRelation(result, loader.ids, 'id');
    }

    @ResolveField(() => [PlayerObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.owner_player_id })
    async ownerPlayer(@Loader({}) loader: LoaderData<PlayerObject, number>) {
        const result = await this.graphQLService.findPlayer(loader.ids);
        return await loader.helpers.mapOneToManyRelation(result, loader.ids, 'id');
    }

    @ResolveField(() => [PlayerObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async players(@Loader({}) loader: LoaderData<PlayerObject, number>) {
        const result = await this.graphQLService.findPlayers(loader.ids);
        return await loader.helpers.mapOneToManyRelation(result, loader.ids, 'game_id');
    }

    // CRUD 

    @Mutation(() => GameObject)
    async addGame(@Args('data') data: NewGameInput) {
        return await this.gameService.insertGame(data);
    }

    @Mutation(() => UpdateGameOutput)
    async updateGame(@Args('data') data: UpdateGameInput) {
        return await this.gameService.updateGame(data);
    }

    @Query(() => GameObject)
    async getGame(@Args('id', { type: () => Int }) id: number): Promise<GameObject> {
        return await this.gameService.getOneGame(id);
    }

    @Query(() => [GameObject])
    async getGames(@Paginator() paginator: PaginatorArgs): Promise<GameObject[]> {
        return await this.gameService.getAllGames(paginator);
    }

    @Mutation(() => DeleteResult)
    async removeGame(@Args('id', { type: () => Int }) id: number) {
        return this.gameService.deleteGame(id);
    }

}
