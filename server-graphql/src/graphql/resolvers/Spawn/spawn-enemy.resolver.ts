import { ResolveField, Resolver } from '@nestjs/graphql';
// 
import { GraphqlLoader, Loader, LoaderData } from 'nestjs-graphql-tools';
import { SpawnScriptEnemyObject } from './spawn.objects';
import { GraphQLService } from '../graphql.service';
import { EnemyObject } from '../Enemy/enemy.objects';



// 
@Resolver(() => SpawnScriptEnemyObject)
export class SpawnScriptEnemyResolver {
    constructor(private readonly graphQLService: GraphQLService) { }

    // fields

    @ResolveField(() => [EnemyObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async enemies(@Loader({}) loader: LoaderData<EnemyObject, number>) {
        const result = await this.graphQLService.findEnemy(loader.ids);
        return await loader.helpers.mapOneToManyRelation(
            result, loader.ids, 'spawn_enemy_id');
    }
}
