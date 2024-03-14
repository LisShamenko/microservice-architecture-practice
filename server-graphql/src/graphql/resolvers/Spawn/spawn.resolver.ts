import { Args, Int, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphqlLoader, Loader, LoaderData, Paginator, PaginatorArgs } from 'nestjs-graphql-tools';
// 
import { SpawnScriptService } from './spawn.service';
import { DeleteResult } from '../graphql.objects';
import { GraphQLService } from '../graphql.service';
import { NewSpawnScriptInput, SpawnScriptEnemyObject, SpawnScriptObject, UpdateSpawnScriptInput } from './spawn.objects';



// 
@Resolver(() => SpawnScriptObject)
export class SpawnScriptResolver {
    constructor(
        private readonly spawnService: SpawnScriptService,
        private readonly graphQLService: GraphQLService,
    ) { }

    // fields

    @ResolveField(() => [SpawnScriptEnemyObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async waves(@Loader({}) loader: LoaderData<SpawnScriptEnemyObject, number>) {
        const result = await this.graphQLService.findSpawnScriptEnemy(loader.ids);
        return await loader.helpers.mapOneToManyRelation(result, loader.ids, 'script_id');
    }

    // CRUD 

    @Mutation(() => SpawnScriptObject)
    async addSpawn(@Args('data') data: NewSpawnScriptInput) {
        return await this.spawnService.insertSpawnScript(data);
    }

    @Mutation(() => SpawnScriptObject)
    async updateSpawn(@Args('data') data: UpdateSpawnScriptInput) {
        return await this.spawnService.updateSpawnScript(data);
    }

    @Query(() => SpawnScriptObject)
    async getSpawn(@Args('id', { type: () => Int }) id: number) {
        return await this.spawnService.getOneSpawnScript(id);
    }

    @Query(() => [SpawnScriptObject])
    async getSpawns(@Paginator() paginator: PaginatorArgs) {
        return await this.spawnService.getAllSpawnScripts(paginator);
    }

    @Mutation(() => DeleteResult)
    async removeSpawn(@Args('id', { type: () => Int }) id: number) {
        return this.spawnService.deleteSpawnScript(id);
    }
}
