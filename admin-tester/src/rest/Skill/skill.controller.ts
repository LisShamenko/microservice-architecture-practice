import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
// 
import { SkillService } from './skill.service';
import { InsertSkillDto } from './dto/InsertSkillDto';
import { UpdateSkillDto } from './dto/UpdateSkillDto';

//
@Controller('skills')
export class SkillController {
    constructor(private readonly skillService: SkillService) { }

    @Post() @Unprotected()
    async insert(@Body() idto: InsertSkillDto) {
        return await this.skillService.insertSkill(idto);
    }

    @Put('/:id') @Unprotected()
    async update(@Param('id') id: number, @Body() udto: UpdateSkillDto) {
        return await this.skillService.updateSkill(id, udto);
    }

    @Delete('/:id') @Unprotected()
    async delete(@Param('id') id: number) {
        return await this.skillService.deleteSkill(id);
    }

    @Get('/:id') @Unprotected()
    async select(@Param('id') id: number) {
        return await this.skillService.getOneSkill(id);
    }

    @Get() @Unprotected()
    async list() {
        return await this.skillService.getAllSkills();
    }
}
