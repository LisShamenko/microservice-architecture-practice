import { ResolveField, Resolver } from '@nestjs/graphql';
import { GraphqlLoader, Loader, LoaderData, PolymorphicLoaderData, SelectedUnionTypes, SelectedUnionTypesResult } from 'nestjs-graphql-tools';
// 
import { ActivityPointTypes } from '../../../modules/Postgres/enums/ActivityPointTypes';
import { GraphQLService } from '../graphql.service';
import { MapService } from './map.service';
import { ActivityPointUnion, MapPointObject } from './map.objects';
import { SpawnObject, TeleportObject } from './map.objects';



// 
function getId(parent: MapPointObject, pointType: ActivityPointTypes) {
    return (parent.pointType === pointType) ? parent.activity_id : -1;
}

@Resolver(() => MapPointObject)
export class MapPointResolver {
    constructor(private readonly graphQLService: GraphQLService) { }

    // 
    @ResolveField(() => SpawnObject, { nullable: true })
    @GraphqlLoader({
        foreignKey: (parent) => getId(parent, ActivityPointTypes.spawn),
    })
    async spawn(@Loader() loader: LoaderData<SpawnObject, number>) {
        const spawns = await this.graphQLService.findSpawns(loader.ids);
        return await loader.helpers.mapManyToOneRelation(spawns, loader.ids, 'activity_id');
    }

    @ResolveField(() => TeleportObject, { nullable: true })
    @GraphqlLoader({
        foreignKey: (parent) => getId(parent, ActivityPointTypes.teleport),
    })
    async teleport(@Loader() loader: LoaderData<TeleportObject, number>) {
        const teleports = await this.graphQLService.findTeleport(loader.ids);
        return await loader.helpers.mapManyToOneRelation(teleports, loader.ids, 'activity_id');
    }



    // 
    @ResolveField(() => [ActivityPointUnion], { nullable: true })
    @GraphqlLoader({
        foreignKey: (parent) => parent.point_id,
        polymorphic: (parent: MapPointObject) => ({
            id: parent.point_id,
            descriminator: parent.pointType,
        })
    })
    async test_polymorphic(
        @Loader() loader: PolymorphicLoaderData<[SpawnObject | TeleportObject], number, ActivityPointTypes>,
        @SelectedUnionTypes() types: SelectedUnionTypesResult,
    ) {
        const results = [];

        // console.log('--- fields of SpawnObject = ', types.getFields(SpawnObject));
        // console.log('--- fields of TeleportObject = ', types.getFields(TeleportObject));

        for (const item of loader.polimorphicTypes) {
            switch (item.descriminator) {

                case ActivityPointTypes.spawn:
                    const spawns = await this.graphQLService.findSpawns(item.ids);
                    results.push({
                        descriminator: ActivityPointTypes.spawn,
                        entities: spawns,
                    });
                    break;

                case ActivityPointTypes.teleport:
                    const teleports = await this.graphQLService.findTeleport(item.ids);
                    results.push({
                        descriminator: ActivityPointTypes.teleport,
                        entities: teleports,
                    });
                    break;

                default: break;
            }
        }

        return await loader.helpers.mapOneToManyPolymorphicRelation(results, loader.ids);
    }
}
