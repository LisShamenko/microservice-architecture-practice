import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
//
import { InsertProductDto } from './dto/InsertProductDto';
import { UpdateProductDto } from './dto/UpdateProductDto';
import { Product, ProductDocument } from '../../modules/Mongo/entity/Product';
import { Requirement } from '../../modules/Mongo/entity/Requirement';
import { SkillHelper } from '../services/SkillHelper';
import { ProductHelper } from '../services/ProductHelper';
import { ErrorHelper } from '../services/ErrorHelper';
import { PropertyHelper } from '../services/PropertyHelper';
import { RedisRepository } from 'src/modules/RedisClient/redis.repository';
import { Prefix } from '../enums/prefix.enum';



//
@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name, 'db')
        private productModel: Model<ProductDocument>,
        private skillHelper: SkillHelper,
        private productHelper: ProductHelper,
        private errorHelper: ErrorHelper,
        private propertyHelper: PropertyHelper,
        @Inject(RedisRepository)
        private repository: RedisRepository,
    ) { }

    // admin
    async insertProduct(idto: InsertProductDto) {

        const tmpSkills: string[] = [];
        await this.skillHelper.addSkills(tmpSkills, idto.skills);

        const tmpRequirements = this.propertyHelper.newRequirements(
            idto.requirement
        );

        const product = {
            title: idto.title,
            price: idto.price,
            max_in_slot: idto.max_in_slot,
            requirements: tmpRequirements,
            skills: tmpSkills,
            // 
            product_type: idto.type_options.type,
            cloth: null,
            shell: null,
            weapon: null,
        } as Product;

        //
        const newProduct = new this.productModel(product);
        const result = await newProduct.save();

        await this.productHelper.newProductType(newProduct, idto.type_options);
        await newProduct.save();
        return { id: result.id };
    }

    // admin
    async updateProduct(product_id: string, udto: UpdateProductDto) {

        const product = await this.productModel
            .where({ _id: product_id })
            .findOne();
        this.errorHelper.foundError(product, 'product_id');

        //
        if (udto.title) product.title = udto.title;
        if (udto.price) product.price = udto.price;
        if (udto.max_in_slot) product.max_in_slot = udto.max_in_slot;

        const requirements = new Requirement();
        this.propertyHelper.setRequirements(requirements, udto.requirement);
        product.requirements = requirements;

        await this.skillHelper.refillSkills(
            product.skills, udto.skills
        );

        await this.productHelper.updateProductType(product, udto.type_options);

        // 
        const result = await product.save();
        return { id: result.id };
    }

    // admin
    async deleteProduct(product_id: string) {
        try {
            const result = await this.productModel
                .deleteOne({ _id: product_id });
            return { rows: result.deletedCount };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }

    // user, admin
    async getOneProduct(product_id: string) {

        let result = await this.repository.getObject(Prefix.product, product_id);
        if (!result) {

            const product = await this.productModel
                .where({ _id: new Types.ObjectId(product_id) })
                .findOne();
            this.errorHelper.foundError(product, 'product_id');

            result = {
                id: product.id,
                title: product.title,
                price: product.price,
                max_in_slot: product.max_in_slot,
                requirement: product.requirements,
                skills: product.skills,
                type: product.product_type,
                cloth: product.cloth,
                shell: product.shell,
                weapon: product.weapon,
            };
            await this.repository.saveObject(Prefix.product, product.id, result);
        }
        return result;
    }

    // user, admin
    async getAllProducts() {

        let result = await this.repository.getList(Prefix.product);
        if (!result) {

            const products = await this.productModel
                .find();

            result = {
                products: (!products) ? [] : products.map(product => ({
                    id: product.id,
                    title: product.title,
                }))
            }
            await this.repository.saveList(Prefix.product, result);
        }
        return result;
    }
}
