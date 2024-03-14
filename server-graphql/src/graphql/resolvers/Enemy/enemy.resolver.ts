import { Args, Int, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphqlLoader, Loader, LoaderData, Paginator, PaginatorArgs } from 'nestjs-graphql-tools';
// 
import { EnemyObject, NewEnemyInput, UpdateEnemyInput } from './enemy.objects';
import { EnemyService } from './enemy.service';
import { GraphQLService } from '../graphql.service';
import { InventoryObject } from '../Product/product.objects';
import { DeleteResult, PlayerPropertyObject } from '../graphql.objects';
import { LevelTemplateObject } from '../LevelTemplate/level-template.objects';
import { SkillObject } from '../Skill/skill.objects';



// 
@Resolver(() => EnemyObject)
export class EnemyResolver {
    constructor(
        private readonly enemyService: EnemyService,
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
        const result = await this.graphQLService.findEnemySkills(loader.ids);
        return await loader.helpers.mapOneToManyRelation(
            result, loader.ids, 'enemy_id');
    }

    // CRUD 

    @Mutation(() => EnemyObject)
    async addEnemy(@Args('data') data: NewEnemyInput) {
        return await this.enemyService.insertEnemy(data);
    }

    @Mutation(() => EnemyObject)
    async updateEnemy(@Args('data') data: UpdateEnemyInput) {
        return await this.enemyService.updateEnemy(data);
    }

    @Query(() => EnemyObject)
    async getEnemy(@Args('id', { type: () => Int }) id: number) {
        return await this.enemyService.getOneEnemy(id);
    }

    @Query(() => [EnemyObject])
    async getEnemies(@Paginator() paginator: PaginatorArgs) {
        return await this.enemyService.getAllEnemies(paginator);
    }

    @Mutation(() => DeleteResult)
    async removeEnemy(@Args('id', { type: () => Int }) id: number) {
        return this.enemyService.deleteEnemy(id);
    }
}
