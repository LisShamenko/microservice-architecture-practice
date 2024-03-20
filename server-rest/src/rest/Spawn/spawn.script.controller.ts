import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
// 
import { SpawnScriptService } from './spawn.script.service';
import { InsertSpawnDto } from './dto/InsertSpawnDto';
import { UpdateSpawnDto } from './dto/UpdateSpawnDto';
import { DeleteRedis } from '../interceptors/delete-redis-object.interceptor';
import { Prefix } from '../enums/prefix.enum';



//
@Controller(Prefix.spawnScript)
export class SpawnScriptController {
    constructor(private readonly spawnService: SpawnScriptService) { }

    @Post()
    @DeleteRedis()
    async insert(@Body() idto: InsertSpawnDto) {
        return await this.spawnService.insertSpawnScript(idto);
    }

    @Put('/:id')
    @DeleteRedis()
    async update(@Param('id') id: string, @Body() udto: UpdateSpawnDto) {
        return await this.spawnService.updateSpawnScript(id, udto);
    }

    @Delete('/:id')
    @DeleteRedis()
    async delete(@Param('id') id: string) {
        return await this.spawnService.deleteSpawnScript(id);
    }

    @Get('/:id')
    async select(@Param('id') id: string) {
        return await this.spawnService.getOneSpawnScript(id);
    }

    @Get()
    async list() {
        return await this.spawnService.getAllSpawnScripts();
    }

}
