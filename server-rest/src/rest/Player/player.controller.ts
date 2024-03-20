import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
// 
import { PlayerService } from './player.service';
import { InsertPlayerDto } from './dto/InsertPlayerDto';
import { UpdatePlayerDto } from './dto/UpdatePlayerDto';
import { DeleteRedis } from '../interceptors/delete-redis-object.interceptor';
import { Prefix } from '../enums/prefix.enum';



//
@Controller(Prefix.player)
export class PlayerController {
    constructor(private readonly playerService: PlayerService) { }

    @Post()
    @DeleteRedis()
    async insert(@Body() idto: InsertPlayerDto) {
        return await this.playerService.insertPlayer(idto);
    }

    @Put('/:id')
    @DeleteRedis()
    async update(@Param('id') id: string, @Body() udto: UpdatePlayerDto) {
        return await this.playerService.updatePlayer(id, udto);
    }

    @Delete('/:id')
    @DeleteRedis()
    async delete(@Param('id') id: string) {
        return await this.playerService.deletePlayer(id);
    }

    @Get('/:id')
    async select(@Param('id') id: string) {
        return await this.playerService.getOnePlayer(id);
    }

    @Get()
    async list() {
        return await this.playerService.getAllPlayers();
    }

}
