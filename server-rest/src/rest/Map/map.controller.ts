import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
// 
import { MapService } from './map.service';
import { InsertMapDto } from './dto/InsertMapDto';
import { UpdateMapDto } from './dto/UpdateMapDto';

//
@Controller('maps')
export class MapController {
    constructor(private readonly mapService: MapService) { }

    @Post()
    async insert(@Body() idto: InsertMapDto) {
        return await this.mapService.insertMap(idto);
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() udto: UpdateMapDto) {
        return await this.mapService.updateMap(id, udto);
    }

    @Delete('/:id')
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
