import { Args, Int, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphqlLoader, Loader, LoaderData, Paginator, PaginatorArgs } from 'nestjs-graphql-tools';
// 
import { NewSkillInput, SkillObject, UpdateSkillInput } from './skill.objects';
import { SkillService } from './skill.service';
import { GraphQLService } from '../graphql.service';
import { DeleteResult, RequirementObject } from '../graphql.objects';



// 
@Resolver(() => SkillObject)
export class SkillResolver {
    constructor(
        private readonly skillService: SkillService,
        private readonly graphQLService: GraphQLService,
    ) { }

    // fields

    @ResolveField(() => [SkillObject], { nullable: true })
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async childSkills(@Loader({}) loader: LoaderData<SkillObject, number>) {
        const result = await this.graphQLService.findChildSkills(loader.ids);
        return await loader.helpers.mapOneToManyRelation(
            result, loader.ids, 'parent_skill_id');
    }

    @ResolveField(() => [SkillObject], { nullable: true })
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async parentSkills(@Loader({}) loader: LoaderData<SkillObject, number>) {
        const result = await this.graphQLService.findParentSkills(loader.ids);
        return await loader.helpers.mapOneToManyRelation(
            result, loader.ids, 'child_id');
    }

    @ResolveField(() => [RequirementObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.requirement_id })
    async requirement(@Loader({}) loader: LoaderData<RequirementObject, number>) {
        const result = await this.graphQLService.findRequirement(loader.ids);
        return await loader.helpers.mapOneToManyRelation(result, loader.ids, 'id');
    }

    // CRUD 

    @Mutation(() => SkillObject)
    async addSkill(@Args('data') data: NewSkillInput) {
        return await this.skillService.insertSkill(data);
    }

    @Mutation(() => SkillObject)
    async updateSkill(@Args('data') data: UpdateSkillInput) {
        return await this.skillService.updateSkill(data);
    }

    @Query(() => SkillObject)
    async getSkill(@Args('id', { type: () => Int }) id: number) {
        return await this.skillService.getOneSkill(id);
    }

    @Query(() => [SkillObject])
    async getSkills(@Paginator() paginator: PaginatorArgs) {
        return await this.skillService.getAllSkills(paginator);
    }

    @Mutation(() => DeleteResult)
    async removeSkill(@Args('id', { type: () => Int }) id: number) {
        return this.skillService.deleteSkill(id);
    }
}
