import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
// 
import { EnemyService } from './enemy.service';
import { InsertEnemyDto } from './dto/InsertEnemyDto';
import { UpdateEnemyDto } from './dto/UpdateEnemyDto';

//
@Controller('enemies')
export class EnemyController {
    constructor(private readonly enemyService: EnemyService) { }

    @Post() @Unprotected()
    async insert(@Body() idto: InsertEnemyDto) {
        return await this.enemyService.insertEnemy(idto);
    }

    @Put('/:id') @Unprotected()
    async update(@Param('id') id: number, @Body() udto: UpdateEnemyDto) {
        return await this.enemyService.updateEnemy(id, udto);
    }

    @Delete('/:id') @Unprotected()
    async delete(@Param('id') id: number) {
        return await this.enemyService.deleteEnemy(id);
    }

    @Get('/:id') @Unprotected()
    async select(@Param('id') id: number) {
        return await this.enemyService.getOneEnemy(id);
    }

    @Get() @Unprotected()
    async list() {
        return await this.enemyService.getAllEnemies();
    }
}
