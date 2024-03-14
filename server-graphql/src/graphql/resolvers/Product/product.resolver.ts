import { Args, Int, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphqlLoader, Loader, LoaderData, Paginator, PaginatorArgs } from 'nestjs-graphql-tools';
// 
import { ProductService } from './product.service';
import { GraphQLService } from '../graphql.service';
import { DeleteResult, RequirementObject } from '../graphql.objects';
import { SkillObject } from '../Skill/skill.objects';
import { NewProductInput, ProductClothObject, ProductObject, ProductShellObject, ProductWeaponObject, UpdateProductInput } from './product.objects';



// 
@Resolver(() => ProductObject)
export class ProductResolver {
    constructor(
        private readonly productService: ProductService,
        private readonly graphQLService: GraphQLService,
    ) { }

    // fields

    @ResolveField(() => [RequirementObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.requirement_id })
    async requirement(@Loader({}) loader: LoaderData<RequirementObject, number>) {
        const result = await this.graphQLService.findRequirement(loader.ids);
        return await loader.helpers.mapOneToManyRelation(result, loader.ids, 'id');
    }

    @ResolveField(() => [ProductClothObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async productCloth(@Loader({}) loader: LoaderData<ProductClothObject, number>) {
        const result = await this.graphQLService.findProductCloth(loader.ids);
        return await loader.helpers.mapOneToManyRelation(result, loader.ids, 'product_id');
    }

    @ResolveField(() => [ProductShellObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async productShell(@Loader({}) loader: LoaderData<ProductShellObject, number>) {
        const result = await this.graphQLService.findProductShell(loader.ids);
        return await loader.helpers.mapOneToManyRelation(result, loader.ids, 'product_id');
    }

    @ResolveField(() => [ProductWeaponObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async productWeapon(@Loader({}) loader: LoaderData<ProductWeaponObject, number>) {
        const result = await this.graphQLService.findProductWeapon(loader.ids);
        return await loader.helpers.mapOneToManyRelation(result, loader.ids, 'product_id');
    }

    @ResolveField(() => [SkillObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async skills(@Loader({}) loader: LoaderData<SkillObject, number>) {
        const result = await this.graphQLService.findProductSkills(loader.ids);
        return await loader.helpers.mapOneToManyRelation(
            result, loader.ids, 'product_id');
    }

    // CRUD 

    @Mutation(() => ProductObject)
    async addProduct(@Args('data') data: NewProductInput) {
        return await this.productService.insertProduct(data);
    }

    @Mutation(() => ProductObject)
    async updateProduct(@Args('data') data: UpdateProductInput) {
        return await this.productService.updateProduct(data);
    }

    @Query(() => ProductObject)
    async getProduct(@Args('id', { type: () => Int }) id: number): Promise<ProductObject> {
        return await this.productService.getOneProduct(id);
    }

    @Query(() => [ProductObject])
    async getProducts(@Paginator() paginator: PaginatorArgs): Promise<ProductObject[]> {
        return await this.productService.getAllProducts(paginator);
    }

    @Mutation(() => DeleteResult)
    async removeProduct(@Args('id', { type: () => Int }) id: number) {
        return this.productService.deleteProduct(id);
    }
}
