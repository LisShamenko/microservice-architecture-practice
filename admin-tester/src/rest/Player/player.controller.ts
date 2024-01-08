import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
// 
import { PlayerService } from './player.service';
import { InsertPlayerDto } from './dto/InsertPlayerDto';
import { UpdatePlayerDto } from './dto/UpdatePlayerDto';

//
@Controller('players')
export class PlayerController {
    constructor(private readonly playerService: PlayerService) { }

    @Post() @Unprotected()
    async insert(@Body() idto: InsertPlayerDto) {
        return await this.playerService.insertPlayer(idto);
    }

    @Put('/:id') @Unprotected()
    async update(@Param('id') id: number, @Body() udto: UpdatePlayerDto) {
        return await this.playerService.updatePlayer(id, udto);
    }

    @Delete('/:id') @Unprotected()
    async delete(@Param('id') id: number) {
        return await this.playerService.deletePlayer(id);
    }

    @Get('/:id') @Unprotected()
    async select(@Param('id') id: number) {
        return await this.playerService.getOnePlayer(id);
    }

    @Get() @Unprotected()
    async list() {
        return await this.playerService.getAllPlayers();
    }

}
