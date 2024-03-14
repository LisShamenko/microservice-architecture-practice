import { Args, Int, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Filter, FilterArgs } from 'nestjs-graphql-tools';
import { GraphqlLoader, Loader, LoaderData } from 'nestjs-graphql-tools';
import { SelectedFields, SelectedFieldsResult } from 'nestjs-graphql-tools';
import { SelectedUnionTypes, SelectedUnionTypesResult } from 'nestjs-graphql-tools';
import { Paginator, PaginatorArgs } from 'nestjs-graphql-tools';
import { SortArgs, Sorting } from 'nestjs-graphql-tools';
// 
import { MapService } from './map.service';
import { GraphQLService } from '../graphql.service';
import { MapObject, MapPointObject, SpawnObject, TeleportObject } from './map.objects';
import { MapFilter, MapSorting, NewMapInput, UpdateMapInput } from './map.objects';
import { ActivityPointTypes } from './../../../modules/Postgres/enums/ActivityPointTypes';
import { DeleteResult } from '../graphql.objects';



// 
@Resolver(() => MapObject)
export class MapResolver {
    constructor(
        private readonly mapService: MapService,
        private readonly graphQLService: GraphQLService,
    ) { }

    // fields

    @ResolveField(() => [MapPointObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async points(
        @Loader({}) loader: LoaderData<MapPointObject, number>,
        @Args('test_add_param', { nullable: true }) test_add_param: string,
        @Filter(() => MapPointObject) test_filter: FilterArgs,
    ) {
        const points = await this.graphQLService.findPoints(loader.ids);
        return await loader.helpers.mapOneToManyRelation(points, loader.ids, 'map_id');
    }

    @ResolveField(() => [MapPointObject])
    @GraphqlLoader({ foreignKey: (parent) => parent.id })
    async points_test_polymorphic(
        @Loader({}) loader: LoaderData<MapPointObject, number>,
        @SelectedUnionTypes({ nestedPolymorphicResolverName: 'test_polymorphic' })
        selectedUnions: SelectedUnionTypesResult
    ) {
        const selectedTypes = Array.from(selectedUnions.types.keys()).map(type => {
            switch (type) {
                case SpawnObject.name: return ActivityPointTypes.spawn;
                case TeleportObject.name: return ActivityPointTypes.teleport;
            }
        });
        const points = await this.graphQLService.findPoints(loader.ids, selectedTypes);
        return await loader.helpers.mapOneToManyRelation(points, loader.ids, 'map_id');
    }

    @Query(() => [MapObject])
    async test_filter_maps(
        @Filter(() => [MapObject, MapFilter]) filter: FilterArgs,
        @Sorting(() => [MapObject, MapSorting], { sqlAlias: 'mp' }) sorting: SortArgs<MapObject>,
        @SelectedFields({ sqlAlias: 't' }) selectedFields: SelectedFieldsResult,
    ) {
        //      order_by: { id: ASC_NULLS_LAST } -> sorting = {id: 'ASC NULLS LAST'}
        console.log('--- fields = ', selectedFields.fieldsData.fieldsString);
        return await this.mapService.getAllMaps({ page: 1, per_page: 30 });
        //      .where(filter).orderBy(sorting)
    }

    // CRUD 

    @Mutation(() => MapObject)
    async addMap(@Args('newMapData') mapInput: NewMapInput) {
        return await this.mapService.createMap(mapInput);
    }

    @Mutation(() => MapObject)
    async updateMap(@Args('newMapData') mapInput: UpdateMapInput) {
        return await this.mapService.updateMap(mapInput);
    }

    @Query(() => MapObject)
    async getMap(@Args('id', { type: () => Int }) id: number) {
        return await this.mapService.getOneMap(id);
    }

    @Query(() => [MapObject])
    async getMaps(@Paginator() paginator: PaginatorArgs) {
        return await this.mapService.getAllMaps(paginator);
    }

    @Mutation(() => DeleteResult)
    async removeMap(@Args('id', { type: () => Int }) id: number) {
        return await this.mapService.removeMap(id);
    }
}
