import { Args, Int, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphqlLoader, Loader, LoaderData, Paginator, PaginatorArgs } from 'nestjs-graphql-tools';
// 
import { PlayerService } from './player.service';
import { GraphQLService } from '../graphql.service';
import { DeleteResult, PlayerPropertyObject } from '../graphql.objects';
import { LevelTemplateObject } from '../LevelTemplate/level-template.objects';
import { InventoryObject } from '../Product/product.objects';
import { SkillObject } from '../Skill/skill.objects';
import { LevelEffectObject, NewPlayerInput, PlayerObject, UpdatePlayerInput } from './player.objects';



// 
@Resolver(() => PlayerObject)
export class PlayerResolver {
    constructor(
        private readonly playerService: PlayerService,
        private readonly graphQLService: GraphQLService,
    ) { }

    // fields

    @ResolveField(() => [InventoryObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.inventory_id })
    async inventory(@Loader({}) loader: LoaderData<InventoryObject, number>) {
        const result = await this.graphQLService.findInventories(loader.ids);
        return await loader.helpers.mapOneToManyRelation(result, loader.ids, 'id');
    }

    @ResolveField(() => [PlayerPropertyObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.properties_id })
    async properties(@Loader({}) loader: LoaderData<PlayerPropertyObject, number>) {
        const result = await this.graphQLService.findProperties(loader.ids);
        return await loader.helpers.mapOneToManyRelation(result, loader.ids, 'id');
    }

    @ResolveField(() => [LevelTemplateObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.level_template_id })
    async template(@Loader({}) loader: LoaderData<LevelTemplateObject, number>) {
        const result = await this.graphQLService.findLevelTemplates(loader.ids);
        return await loader.helpers.mapOneToManyRelation(result, loader.ids, 'id');
    }

    @ResolveField(() => [SkillObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async skills(@Loader({}) loader: LoaderData<SkillObject, number>) {
        const result = await this.graphQLService.findPlayerSkills(loader.ids);
        return await loader.helpers.mapOneToManyRelation(
            result, loader.ids, 'player_id');
    }

    @ResolveField(() => [LevelEffectObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async effects(@Loader({}) loader: LoaderData<LevelEffectObject, number>) {
        const result = await this.graphQLService.findPlayerEffects(loader.ids);
        return await loader.helpers.mapOneToManyRelation(
            result, loader.ids, 'player_id');
    }

    // CRUD 

    @Mutation(() => PlayerObject)
    async addPlayer(@Args('data') data: NewPlayerInput) {
        return await this.playerService.insertPlayer(data);
    }

    @Mutation(() => PlayerObject)
    async updatePlayer(@Args('data') data: UpdatePlayerInput) {
        return await this.playerService.updatePlayer(data);
    }

    @Query(() => PlayerObject)
    async getPlayer(@Args('id', { type: () => Int }) id: number): Promise<PlayerObject> {
        return await this.playerService.getOnePlayer(id);
    }

    @Query(() => [PlayerObject])
    async getPlayers(@Paginator() paginator: PaginatorArgs): Promise<PlayerObject[]> {
        return await this.playerService.getAllPlayers(paginator);
    }

    @Mutation(() => DeleteResult)
    async removePlayer(@Args('id', { type: () => Int }) id: number) {
        return this.playerService.deletePlayer(id);
    }
}
