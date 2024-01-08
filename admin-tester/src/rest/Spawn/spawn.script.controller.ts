import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
// 
import { SpawnScriptService } from './spawn.script.service';
import { InsertSpawnDto } from './dto/InsertSpawnDto';
import { UpdateSpawnDto } from './dto/UpdateSpawnDto';

//
@Controller('spawn-script')
export class SpawnScriptController {
    constructor(private readonly spawnService: SpawnScriptService) { }

    @Post() @Unprotected()
    async insert(@Body() idto: InsertSpawnDto) {
        return await this.spawnService.insertSpawnScript(idto);
    }

    @Put('/:id') @Unprotected()
    async update(@Param('id') id: number, @Body() udto: UpdateSpawnDto) {
        return await this.spawnService.updateSpawnScript(id, udto);
    }

    @Delete('/:id') @Unprotected()
    async delete(@Param('id') id: number) {
        return await this.spawnService.deleteSpawnScript(id);
    }

    @Get('/:id') @Unprotected()
    async select(@Param('id') id: number) {
        return await this.spawnService.getOneSpawnScript(id);
    }

    @Get() @Unprotected()
    async list() {
        return await this.spawnService.getAllSpawnScripts();
    }

}
