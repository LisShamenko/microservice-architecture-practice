import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
// 
import { ProductService } from './product.service';
import { InsertProductDto } from './dto/InsertProductDto';
import { UpdateProductDto } from './dto/UpdateProductDto';

//
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post() @Unprotected()
    async insert(@Body() idto: InsertProductDto) {
        return await this.productService.insertProduct(idto);
    }

    @Put('/:id') @Unprotected()
    async update(@Param('id') id: number, @Body() udto: UpdateProductDto) {
        return await this.productService.updateProduct(id, udto);
    }

    @Delete('/:id') @Unprotected()
    async delete(@Param('id') id: number) {
        return await this.productService.deleteProduct(id);
    }

    @Get('/:id') @Unprotected()
    async select(@Param('id') id: number) {
        return await this.productService.getOneProduct(id);
    }

    @Get() @Unprotected()
    async list() {
        return await this.productService.getAllProducts();
    }

}
