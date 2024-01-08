import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
// 
import { InsertGameDto } from './dto/InsertGameDto';
import { UpdateGameDto } from './dto/UpdateGameDto';
import { GameService } from './game.service';

//
@Controller('games')
export class GameController {
    constructor(private readonly gameService: GameService) { }

    @Post() @Unprotected()
    async insert(@Body() idto: InsertGameDto) {
        return await this.gameService.insertGame(idto);
    }

    @Put('/:id') @Unprotected()
    async update(@Param('id') id: number, @Body() udto: UpdateGameDto) {
        return await this.gameService.updateGame(id, udto);
    }

    @Delete('/:id') @Unprotected()
    async delete(@Param('id') id: number, @Query('owner') owner) {
        return await this.gameService.deleteGame(id, owner);
    }

    @Get('/:id') @Unprotected()
    async select(@Param('id') id: number) {
        return await this.gameService.getOneGame(id);
    }

    @Get() @Unprotected()
    async list() {
        return await this.gameService.getAllGames();
    }

}
