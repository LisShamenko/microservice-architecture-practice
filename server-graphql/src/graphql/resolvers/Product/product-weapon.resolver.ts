import { ResolveField, Resolver } from '@nestjs/graphql';
import { GraphqlLoader, Loader, LoaderData } from 'nestjs-graphql-tools';
//
import { ProductShellObject, ProductWeaponObject } from './product.objects';
import { GraphQLService } from '../graphql.service';



// 
@Resolver(() => ProductWeaponObject)
export class ProductWeaponResolver {
    constructor(private readonly graphQLService: GraphQLService) { }

    // fields

    @ResolveField(() => [ProductShellObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async shells(@Loader({}) loader: LoaderData<ProductShellObject, number>) {
        const result = await this.graphQLService.findProducts(loader.ids);
        return await loader.helpers.mapOneToManyRelation(result, loader.ids, 'weapon_id');
    }
}
