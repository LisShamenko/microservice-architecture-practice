import { Args, Int, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphqlLoader, Loader, LoaderData, Paginator, PaginatorArgs } from 'nestjs-graphql-tools';
// 
import { LevelTemplateService } from './level-template.service';
import { GraphQLService } from '../graphql.service';
import { LevelTemplateObject, NewLevelTemplateInput, UpdateLevelTemplateInput } from './level-template.objects';
import { DeleteResult, PlayerPropertyObject } from '../graphql.objects';
import { InventoryObject } from '../Product/product.objects';
import { SkillObject } from '../Skill/skill.objects';



// 
@Resolver(() => LevelTemplateObject)
export class LevelTemplateResolver {
    constructor(
        private readonly templateService: LevelTemplateService,
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

    @ResolveField(() => [SkillObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async skills(@Loader({}) loader: LoaderData<SkillObject, number>) {
        const result = await this.graphQLService.findTemplateSkills(loader.ids);
        return await loader.helpers.mapOneToManyRelation(
            result, loader.ids, 'level_template_id');
    }

    // CRUD 

    @Mutation(() => LevelTemplateObject)
    async addTemplate(@Args('data') data: NewLevelTemplateInput) {
        return await this.templateService.insertTemplate(data);
    }

    @Mutation(() => LevelTemplateObject)
    async updateTemplate(@Args('data') data: UpdateLevelTemplateInput) {
        return await this.templateService.updateTemplate(data);
    }

    @Query(() => LevelTemplateObject)
    async getTemplate(@Args('id', { type: () => Int }) id: number) {
        return await this.templateService.getOneTemplate(id);
    }

    @Query(() => [LevelTemplateObject])
    async getTemplates(@Paginator() paginator: PaginatorArgs) {
        return await this.templateService.getAllTemplates(paginator);
    }

    @Mutation(() => DeleteResult)
    async removeTemplate(@Args('id', { type: () => Int }) id: number) {
        return this.templateService.deleteTemplate(id);
    }
}
