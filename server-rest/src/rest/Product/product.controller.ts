import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
// 
import { ProductService } from './product.service';
import { InsertProductDto } from './dto/InsertProductDto';
import { UpdateProductDto } from './dto/UpdateProductDto';
import { DeleteRedis } from '../interceptors/delete-redis-object.interceptor';
import { Prefix } from '../enums/prefix.enum';



//
@Controller(Prefix.product)
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @DeleteRedis()
    async insert(@Body() idto: InsertProductDto) {
        return await this.productService.insertProduct(idto);
    }

    @Put('/:id')
    @DeleteRedis()
    async update(@Param('id') id: string, @Body() udto: UpdateProductDto) {
        return await this.productService.updateProduct(id, udto);
    }

    @Delete('/:id')
    @DeleteRedis()
    async delete(@Param('id') id: string) {
        return await this.productService.deleteProduct(id);
    }

    @Get('/:id')
    async select(@Param('id') id: string) {
        return await this.productService.getOneProduct(id);
    }

    @Get()
    async list() {
        return await this.productService.getAllProducts();
    }

}
