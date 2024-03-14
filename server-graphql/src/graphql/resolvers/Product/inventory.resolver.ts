import { ResolveField, Resolver } from '@nestjs/graphql';
import { GraphqlLoader, Loader, LoaderData } from 'nestjs-graphql-tools';
// 
import { InventoryObject, InventoryProductObject } from './product.objects';
import { GraphQLService } from '../graphql.service';



// 
@Resolver(() => InventoryObject)
export class InventoryResolver {
    constructor(private readonly graphQLService: GraphQLService) { }

    // fields

    @ResolveField(() => [InventoryProductObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async inventoryProducts(@Loader({}) loader: LoaderData<InventoryProductObject, number>) {
        const result = await this.graphQLService.findProducts(loader.ids);
        return await loader.helpers.mapOneToManyRelation(result, loader.ids, 'inventory_id');
    }
}
