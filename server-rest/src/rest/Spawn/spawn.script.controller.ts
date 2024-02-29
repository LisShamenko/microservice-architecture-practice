import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
// 
import { SpawnScriptService } from './spawn.script.service';
import { InsertSpawnDto } from './dto/InsertSpawnDto';
import { UpdateSpawnDto } from './dto/UpdateSpawnDto';

//
@Controller('spawn-script')
export class SpawnScriptController {
    constructor(private readonly spawnService: SpawnScriptService) { }

    @Post()
    async insert(@Body() idto: InsertSpawnDto) {
        return await this.spawnService.insertSpawnScript(idto);
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() udto: UpdateSpawnDto) {
        return await this.spawnService.updateSpawnScript(id, udto);
    }

    @Delete('/:id')
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
