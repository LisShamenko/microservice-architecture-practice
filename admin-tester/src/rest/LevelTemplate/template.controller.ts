import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
// 
import { TemplateService } from './template.service';
import { InsertTemplateDto } from './dto/InsertTemplateDto';
import { UpdateTemplateDto } from './dto/UpdateTemplateDto';

//
@Controller('templates')
export class TemplateController {
    constructor(private readonly templateService: TemplateService) { }

    @Post() @Unprotected()
    async insert(@Body() idto: InsertTemplateDto) {
        return await this.templateService.insertTemplate(idto);
    }

    @Put('/:id') @Unprotected()
    async update(@Param('id') id: number, @Body() udto: UpdateTemplateDto) {
        return await this.templateService.updateTemplate(id, udto);
    }

    @Delete('/:id') @Unprotected()
    async delete(@Param('id') id: number) {
        return await this.templateService.deleteTemplate(id);
    }

    @Get('/:id') @Unprotected()
    async select(@Param('id') id: number) {
        return await this.templateService.getOneTemplate(id);
    }

    @Get() @Unprotected()
    async list() {
        return await this.templateService.getAllTemplates();
    }

}
