import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { assign } from 'lodash';
import { DataSource } from 'typeorm';
//
import { InsertProductDto } from './dto/InsertProductDto';
import { UpdateProductDto } from './dto/UpdateProductDto';
import { Product } from '../../modules/Postgres/entity/Product';
import { Requirement } from '../../modules/Postgres/entity/Requirement';
import { ProductSkill } from '../../modules/Postgres/entity/ProductSkill';
import { ProductCloth } from '../../modules/Postgres/entity/ProductCloth';
import { ProductShell } from '../../modules/Postgres/entity/ProductShell';
import { ProductWeapon } from '../../modules/Postgres/entity/ProductWeapon';
import { ProductTypes } from '../../modules/Postgres/enums/ProductTypes';
import { SkillHelper } from '../services/SkillHelper';
import { ProductHelper } from '../services/ProductHelper';
import { ErrorHelper } from '../services/ErrorHelper';

//
@Injectable()
export class ProductService {
    constructor(
        @InjectDataSource('postgres_db') private dataSource: DataSource,
        private skillHelper: SkillHelper,
        private productHelper: ProductHelper,
        private errorHelper: ErrorHelper,
    ) { }

    // 
    async insertProduct(idto: InsertProductDto) {

        const product = new Product();
        product.title = idto.title;
        product.price = idto.price;
        product.max_in_slot = idto.max_in_slot;
        product.product_type = idto.type;

        const requirement = assign(new Requirement(), idto.requirement);
        product.requirement = requirement;

        const tmpSkills: ProductSkill[] = [];
        this.skillHelper.addProductSkills(tmpSkills, idto.skills);
        product.skills = tmpSkills;

        //
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(requirement);

            await queryRunner.manager.save(product);

            if (tmpSkills.length > 0) {
                tmpSkills.forEach(s => { s.product_id = product.id });
                await queryRunner.manager.save(tmpSkills);
            }

            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.errorHelper.transactionError(err.message);
        }
        finally {
            await queryRunner.release();
        }
        return { id: product.id };
    }

    // 
    async updateProduct(product_id: number, udto: UpdateProductDto) {

        const product = await this.dataSource.getRepository(Product)
            .findOne({
                where: { id: product_id },
                relations: {
                    requirement: true,
                    skills: true,
                },
            });
        this.errorHelper.foundError(product, 'product_id');

        //
        if (udto.title) product.title = udto.title;
        if (udto.price) product.price = udto.price;
        if (udto.max_in_slot) product.max_in_slot = udto.max_in_slot;
        assign(product.requirement, udto.requirement);

        // 
        const tmpSkills = product.skills;
        const removeSkills = this.skillHelper.filterSkills(tmpSkills, udto.skills);
        await this.skillHelper.refillProductSkills(tmpSkills, udto.skills);

        // 
        const updates = this.productHelper.getTypeUpdates(product, udto.type);
        product.product_type = udto.type;

        // 
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            await queryRunner.manager.save(product.requirement);

            if (removeSkills.length > 0) {
                await queryRunner.manager.remove(removeSkills);
            }

            if (tmpSkills.length > 0) {
                tmpSkills.forEach(s => { s.product_id = product.id });
                await queryRunner.manager.save(tmpSkills);
            }

            if (updates) {
                this.productHelper.updateTypes(queryRunner, updates);
            }

            await queryRunner.manager.save(product);

            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.errorHelper.transactionError(err.message);
        }
        finally {
            await queryRunner.release();
        }
        return { id: product.id };
    }

    // 
    async deleteProduct(product_id: number) {
        try {
            const result = await this.dataSource.getRepository(Product)
                .delete({ id: product_id });
            return { rows: result.affected };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }

    // 
    async getOneProduct(product_id: number) {
        const product = await this.dataSource.getRepository(Product)
            .findOne({
                where: {
                    id: product_id,
                },
                relations: {
                    requirement: true,
                    //      productCloth: true,
                    //      productShell: true,
                    //      productWeapon: true,
                    skills: true,
                },
            });
        this.errorHelper.foundError(product, 'product_id');

        return {
            id: product.id,
            title: product.title,
            price: product.price,
            max_in_slot: product.max_in_slot,
            requirement: product.requirement,
            skills: product.skills.map(s => s.skill_id),
            type: product.product_type,
        };
    }

    // 
    async getAllProducts() {
        const products = await this.dataSource.getRepository(Product)
            .find();
            
        return {
            products: (!products) ? [] : products.map(product => ({
                id: product.id,
                title: product.title,
            }))
        }
    }
}
