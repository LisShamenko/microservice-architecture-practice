import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
// 
import { PlayerService } from './player.service';
import { InsertPlayerDto } from './dto/InsertPlayerDto';
import { UpdatePlayerDto } from './dto/UpdatePlayerDto';

//
@Controller('players')
export class PlayerController {
    constructor(private readonly playerService: PlayerService) { }

    @Post()
    async insert(@Body() idto: InsertPlayerDto) {
        return await this.playerService.insertPlayer(idto);
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() udto: UpdatePlayerDto) {
        return await this.playerService.updatePlayer(id, udto);
    }

    @Delete('/:id')
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
