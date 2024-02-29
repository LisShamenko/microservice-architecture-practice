import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
// 
import { InsertGameDto } from './dto/InsertGameDto';
import { UpdateGameDto } from './dto/UpdateGameDto';
import { GameService } from './game.service';

//
@Controller('games')
export class GameController {
    constructor(private readonly gameService: GameService) { }

    @Post()
    async insert(@Body() idto: InsertGameDto) {
        return await this.gameService.insertGame(idto);
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() udto: UpdateGameDto) {
        return await this.gameService.updateGame(id, udto);
    }

    @Delete('/:id')
    async delete(@Param('id') id: string, @Query('owner') owner: string) {
        return await this.gameService.deleteGame(id, owner);
    }

    @Get('/:id')
    async select(@Param('id') id: string) {
        return await this.gameService.getOneGame(id);
    }

    @Get()
    async list() {
        return await this.gameService.getAllGames();
    }

}
