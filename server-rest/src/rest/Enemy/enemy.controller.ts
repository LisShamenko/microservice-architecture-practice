import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
// 
import { EnemyService } from './enemy.service';
import { InsertEnemyDto } from './dto/InsertEnemyDto';
import { UpdateEnemyDto } from './dto/UpdateEnemyDto';
import { DeleteRedis } from '../interceptors/delete-redis-object.interceptor';
import { Prefix } from '../enums/prefix.enum';



//
@Controller(Prefix.enemy)
export class EnemyController {
    constructor(private readonly enemyService: EnemyService) { }

    @Post()
    @DeleteRedis()
    async insert(@Body() idto: InsertEnemyDto) {
        return await this.enemyService.insertEnemy(idto);
    }

    @Put('/:id')
    @DeleteRedis()
    async update(@Param('id') id: string, @Body() udto: UpdateEnemyDto) {
        return await this.enemyService.updateEnemy(id, udto);
    }

    @Delete('/:id')
    @DeleteRedis()
    async delete(@Param('id') id: string) {
        return await this.enemyService.deleteEnemy(id);
    }

    @Get('/:id')
    async select(@Param('id') id: string) {
        return await this.enemyService.getOneEnemy(id);
    }

    @Get()
    async list() {
        return await this.enemyService.getAllEnemies();
    }
}
