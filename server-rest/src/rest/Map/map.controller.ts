import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
// 
import { MapService } from './map.service';
import { InsertMapDto } from './dto/InsertMapDto';
import { UpdateMapDto } from './dto/UpdateMapDto';
import { DeleteRedis } from '../interceptors/delete-redis-object.interceptor';
import { Prefix } from '../enums/prefix.enum';



//
@Controller(Prefix.map)
export class MapController {
    constructor(private readonly mapService: MapService) { }

    @Post()
    @DeleteRedis()
    async insert(@Body() idto: InsertMapDto) {
        return await this.mapService.insertMap(idto);
    }

    @Put('/:id')
    @DeleteRedis()
    async update(@Param('id') id: string, @Body() udto: UpdateMapDto) {
        return await this.mapService.updateMap(id, udto);
    }

    @Delete('/:id')
    @DeleteRedis()
    async delete(@Param('id') id: string) {
        return await this.mapService.deleteMap(id);
    }

    @Get('/:id')
    async select(@Param('id') id: string) {
        return await this.mapService.getOneMap(id);
    }

    @Get()
    async list() {
        return await this.mapService.getAllMaps();
    }

}
