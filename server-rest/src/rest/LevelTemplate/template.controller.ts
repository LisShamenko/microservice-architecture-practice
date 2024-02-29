import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
// 
import { TemplateService } from './template.service';
import { InsertTemplateDto } from './dto/InsertTemplateDto';
import { UpdateTemplateDto } from './dto/UpdateTemplateDto';

//
@Controller('templates')
export class TemplateController {
    constructor(private readonly templateService: TemplateService) { }

    @Post()
    async insert(@Body() idto: InsertTemplateDto) {
        return await this.templateService.insertTemplate(idto);
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() udto: UpdateTemplateDto) {
        return await this.templateService.updateTemplate(id, udto);
    }

    @Delete('/:id')
    async delete(@Param('id') id: string) {
        return await this.templateService.deleteTemplate(id);
    }

    @Get('/:id')
    async select(@Param('id') id: string) {
        return await this.templateService.getOneTemplate(id);
    }

    @Get()
    async list() {
        return await this.templateService.getAllTemplates();
    }

}
