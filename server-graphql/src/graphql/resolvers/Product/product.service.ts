import { Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { PaginatorArgs } from 'nestjs-graphql-tools';
//
import { Product } from '../../../modules/Postgres/entity/Product';
import { ProductSkill } from '../../../modules/Postgres/entity/ProductSkill';
import { InventoryProduct } from '../../../modules/Postgres/entity/InventoryProduct';
import { ProductTypes } from '../../../modules/Postgres/enums/ProductTypes';
import { ProductCloth } from '../../../modules/Postgres/entity/ProductCloth';
import { ProductShell } from '../../../modules/Postgres/entity/ProductShell';
import { ProductWeapon } from '../../../modules/Postgres/entity/ProductWeapon';
import { PropertyHelper } from '../services/PropertyHelper';
import { SkillHelper } from '../services/SkillHelper';
import { ProductHelper } from '../services/ProductHelper';
import { ErrorHelper } from '../services/ErrorHelper';
import { NewProductInput, ProductObject, UpdateProductInput } from './product.objects';



// 
@Injectable()
export class ProductService {
    private repoProduct: Repository<Product>;
    private repoProductSkill: Repository<ProductSkill>;
    private repoInventoryProduct: Repository<InventoryProduct>;

    constructor(
        private sequelize: Sequelize,
        private propertyHelper: PropertyHelper,
        private skillHelper: SkillHelper,
        private productHelper: ProductHelper,
        private errorHelper: ErrorHelper,
    ) {
        this.repoProduct = this.sequelize.getRepository(Product);
        this.repoProductSkill = this.sequelize.getRepository(ProductSkill);
        this.repoInventoryProduct = this.sequelize.getRepository(InventoryProduct);
    }

    // 
    async insertProduct(idto: NewProductInput) {

        const requirement = this.propertyHelper
            .newRequirements(idto.requirement);

        const tmpSkills: ProductSkill[] = [];
        this.skillHelper.addProductSkills(tmpSkills, idto.skills);

        //
        const product = new Product();
        product.title = idto.title;
        product.price = idto.price;
        product.max_in_slot = idto.max_in_slot;
        product.product_type = idto.type;

        // 
        let cloth, shell, weapon;
        if (idto.type === ProductTypes.cloth) cloth = new ProductCloth();
        if (idto.type === ProductTypes.shell) shell = new ProductShell();
        if (idto.type === ProductTypes.weapon) weapon = new ProductWeapon();

        // 
        const t = await this.sequelize.transaction();
        try {

            await requirement.save({ transaction: t });
            product.requirement_id = requirement.id;

            await product.save({ transaction: t });

            if (tmpSkills.length > 0) {
                for (const s of tmpSkills) {
                    s.product_id = product.id;
                    await s.save({ transaction: t });
                }
            }

            await this.productHelper.insertCloth(cloth, product.id, t);
            await this.productHelper.insertShell(shell, product.id, t);
            await this.productHelper.insertWeapon(weapon, product.id, t);

            await t.commit();
        }
        catch (err) {
            await t.rollback();
            this.errorHelper.transactionError(err.message);
        }
        return product;
    }

    async updateProduct(udto: UpdateProductInput) {

        const product = await this.repoProduct.findOne({
            where: { id: udto.product_id },
            include: [
                'requirement', 'linkProductSkill',
                'productCloth', 'productShell', 'productWeapon',
            ],
        });
        this.errorHelper.foundError(product, 'product_id');

        //
        if (udto.title) product.title = udto.title;
        if (udto.price) product.price = udto.price;
        if (udto.max_in_slot) product.max_in_slot = udto.max_in_slot;
        this.propertyHelper.setRequirements(product.requirement, udto.requirement);

        const tmpSkills = product.linkProductSkill;
        const removeSkills = this.skillHelper.filterSkills(tmpSkills, udto.skills);
        await this.skillHelper.refillProductSkills(tmpSkills, udto.skills);

        const updates = this.productHelper.getTypeUpdates(product, udto.type);
        product.product_type = udto.type;

        // 
        const t = await this.sequelize.transaction();
        try {

            await this.repoProductSkill.destroy({
                where: { id: removeSkills.map(r => r.id) },
                transaction: t,
            });

            if (tmpSkills.length > 0) {
                for (const s of tmpSkills) {
                    s.product_id = product.id;
                    await s.save({ transaction: t });
                }
            }

            if (updates) {
                await this.productHelper.updateTypes(updates, t);
            }

            await product.requirement.save({ transaction: t });
            await product.save({ transaction: t });

            await t.commit();
        }
        catch (err) {
            await t.rollback();
            this.errorHelper.transactionError(err.message);
        }
        return product;
    }

    async getOneProduct(product_id: number): Promise<ProductObject> {
        return await this.repoProduct.findOne({ where: { id: product_id } });
    }

    async getAllProducts(paginator: PaginatorArgs): Promise<ProductObject[]> {
        if (paginator) {
            return await this.repoProduct.findAll({
                offset: paginator.page * paginator.per_page,
                limit: paginator.per_page,
            });
        }
        return await this.repoProduct.findAll();
    }

    async deleteProduct(product_id: number) {
        try {
            const result = await this.repoProduct.destroy({
                where: { id: product_id },
                force: true,
            });
            return { rows: result };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }
}
