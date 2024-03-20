import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
// 
import { SkillService } from './skill.service';
import { InsertSkillDto } from './dto/InsertSkillDto';
import { UpdateSkillDto } from './dto/UpdateSkillDto';
import { DeleteRedis } from '../interceptors/delete-redis-object.interceptor';
import { Prefix } from '../enums/prefix.enum';



//
@Controller(Prefix.skill)
export class SkillController {
    constructor(private readonly skillService: SkillService) { }

    @Post()
    @DeleteRedis()
    async insert(@Body() idto: InsertSkillDto) {
        return await this.skillService.insertSkill(idto);
    }

    @Put('/:id')
    @DeleteRedis()
    async update(@Param('id') id: string, @Body() udto: UpdateSkillDto) {
        return await this.skillService.updateSkill(id, udto);
    }

    @Delete('/:id')
    @DeleteRedis()
    async delete(@Param('id') id: string) {
        return await this.skillService.deleteSkill(id);
    }

    @Get('/:id')
    async select(@Param('id') id: string) {
        return await this.skillService.getOneSkill(id);
    }

    @Get()
    async list() {
        return await this.skillService.getAllSkills();
    }
}
