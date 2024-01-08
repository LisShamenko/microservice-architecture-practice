import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
// 
import { MapService } from './map.service';
import { InsertMapDto } from './dto/InsertMapDto';
import { UpdateMapDto } from './dto/UpdateMapDto';

//
@Controller('maps')
export class MapController {
    constructor(private readonly mapService: MapService) { }

    @Post() @Unprotected()
    async insert(@Body() idto: InsertMapDto) {
        return await this.mapService.insertMap(idto);
    }

    @Put('/:id') @Unprotected()
    async update(@Param('id') id: number, @Body() udto: UpdateMapDto) {
        return await this.mapService.updateMap(id, udto);
    }

    @Delete('/:id') @Unprotected()
    async delete(@Param('id') id: number) {
        return await this.mapService.deleteMap(id);
    }

    @Get('/:id') @Unprotected()
    async select(@Param('id') id: number) {
        return await this.mapService.getOneMap(id);
    }

    @Get() @Unprotected()
    async list() {
        return await this.mapService.getAllMaps();
    }

}
