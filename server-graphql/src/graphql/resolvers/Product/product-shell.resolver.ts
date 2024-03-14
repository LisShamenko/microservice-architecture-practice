import { ResolveField, Resolver } from '@nestjs/graphql';
import { GraphqlLoader, Loader, LoaderData } from 'nestjs-graphql-tools';
// 
import { ProductShellObject, ProductWeaponObject } from './product.objects';
import { GraphQLService } from '../graphql.service';



// 
@Resolver(() => ProductShellObject)
export class ProductShellResolver {
    constructor(private readonly graphQLService: GraphQLService) { }

    // fields

    @ResolveField(() => [ProductWeaponObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async weapons(@Loader({}) loader: LoaderData<ProductWeaponObject, number>) {
        const result = await this.graphQLService.findShells(loader.ids);
        return await loader.helpers.mapOneToManyRelation(result, loader.ids, 'shell_id');
    }
}
