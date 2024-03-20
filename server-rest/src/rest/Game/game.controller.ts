import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
// 
import { InsertGameDto } from './dto/InsertGameDto';
import { UpdateGameDto } from './dto/UpdateGameDto';
import { GameService } from './game.service';
import { DeleteRedis } from '../interceptors/delete-redis-object.interceptor';
import { Prefix } from '../enums/prefix.enum';



//
@Controller(Prefix.game)
export class GameController {
    constructor(private readonly gameService: GameService) { }

    @Post()
    @DeleteRedis()
    async insert(@Body() idto: InsertGameDto) {
        return await this.gameService.insertGame(idto);
    }

    @Put('/:id')
    @DeleteRedis()
    async update(@Param('id') id: string, @Body() udto: UpdateGameDto) {
        return await this.gameService.updateGame(id, udto);
    }

    @Delete('/:id')
    @DeleteRedis()
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
