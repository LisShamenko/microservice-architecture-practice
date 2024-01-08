import { InjectDataSource } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { DataSource, In, QueryRunner } from "typeorm";
import { clamp } from "lodash";
// 
import { ProductItemDto } from "../dto/ProductItemDto";
import { FillProductsDto } from "../dto/FillProductsDto";
import { InventoryProduct } from "src/modules/Postgres/entity/InventoryProduct";
import { Product } from "src/modules/Postgres/entity/Product";
import { ProductTypes } from "src/modules/Postgres/entity/enums";
import { ProductCloth } from "src/modules/Postgres/entity/ProductCloth";
import { ProductShell } from "src/modules/Postgres/entity/ProductShell";
import { ProductWeapon } from "src/modules/Postgres/entity/ProductWeapon";

// 
export interface IProductUpdates {
    removeCloth: ProductCloth;
    removeShell: ProductShell;
    removeWeapon: ProductWeapon;
    addCloth: ProductCloth;
    addShell: ProductShell;
    addWeapon: ProductWeapon;
}

@Injectable()
export class ProductHelper {
    constructor(
        @InjectDataSource('postgres_db') private dataSource: DataSource,
    ) { }

    async refillProducts(tmpProducts: InventoryProduct[], products: FillProductsDto) {
        if (products) {
            await this.addProductsToList(tmpProducts, products.add);
            this.removeProductsFromList(tmpProducts, products.remove);
        }
    }

    async addProductsToList(tmpProducts: InventoryProduct[], idtoProducts: ProductItemDto[]) {
        if (!idtoProducts || idtoProducts.length <= 0) return;

        // refactor_10 - запрос in, кеширование словарей типа Product
        const product_ids = idtoProducts.map(p => p.product_id);
        const products = await this.dataSource.getRepository(Product).find({
            select: { id: true, max_in_slot: true },
            where: { id: In(product_ids) }
        });

        idtoProducts.forEach(idto_p => {
            const curProd = products.find(p => p.id === idto_p.product_id);

            if (curProd) {
                const tmpProd = tmpProducts.find(
                    p => p.product_id === idto_p.product_id
                );

                if (tmpProd) {
                    // refactor_10 - ограничение для админа в max_in_slot
                    const sum = tmpProd.count_in_all_slots + idto_p.count_in_slots;
                    tmpProd.count_in_all_slots = clamp(sum, 0, curProd.max_in_slot);
                }
                else {
                    const inventoryProduct = new InventoryProduct();
                    inventoryProduct.product_id = idto_p.product_id;
                    inventoryProduct.count_in_all_slots = clamp(
                        idto_p.count_in_slots, 0, curProd.max_in_slot
                    );
                    tmpProducts.push(inventoryProduct);
                }
            }
        });
    }

    removeProductsFromList(tmpProducts: InventoryProduct[], idtoProducts: ProductItemDto[]) {
        if (!idtoProducts || idtoProducts.length <= 0) return;

        idtoProducts.forEach(idto_p => {
            const tmpProd = tmpProducts.find(p => p.product_id === idto_p.product_id);
            if (tmpProd) {
                // refactor_10 - ограничение для админа в max_in_slot
                const diff = tmpProd.count_in_all_slots - Math.abs(idto_p.count_in_slots);
                tmpProd.count_in_all_slots = (diff < 0) ? 0 : diff;
            }
        });
    }

    getTypeUpdates(product: Product, udto_type: ProductTypes): IProductUpdates {
        if (product.product_type === udto_type) return;

        let removeCloth: ProductCloth;
        let removeShell: ProductShell;
        let removeWeapon: ProductWeapon;

        let addCloth: ProductCloth;
        let addShell: ProductShell;
        let addWeapon: ProductWeapon;

        product.product_type = udto_type;

        if (udto_type === ProductTypes.none) {
            if (product.product_type === ProductTypes.cloth)
                removeCloth = product.productCloth;
            else if (product.product_type === ProductTypes.shell)
                removeShell = product.productShell;
            else if (product.product_type === ProductTypes.weapon)
                removeWeapon = product.productWeapon;
        }
        else if (udto_type === ProductTypes.cloth) {
            addCloth = new ProductCloth();
            addCloth.product_id = product.id;

            if (product.product_type === ProductTypes.shell)
                removeShell = product.productShell;
            else if (product.product_type === ProductTypes.weapon)
                removeWeapon = product.productWeapon;
        }
        else if (udto_type === ProductTypes.shell) {
            addShell = new ProductShell();
            addShell.product_id = product.id;

            if (product.product_type === ProductTypes.cloth)
                removeCloth = product.productCloth;
            else if (product.product_type === ProductTypes.weapon)
                removeWeapon = product.productWeapon;
        }
        else if (udto_type === ProductTypes.weapon) {
            addWeapon = new ProductWeapon;
            addWeapon.product_id = product.id;

            if (product.product_type === ProductTypes.cloth)
                removeCloth = product.productCloth;
            else if (product.product_type === ProductTypes.shell)
                removeShell = product.productShell;
        }

        return {
            removeCloth, removeShell, removeWeapon,
            addCloth, addShell, addWeapon,
        }
    }

    async updateTypes(queryRunner: QueryRunner, updateTypes: IProductUpdates) {
        if (updateTypes.removeCloth)
            await queryRunner.manager.save(updateTypes.removeCloth);
        if (updateTypes.removeShell)
            await queryRunner.manager.save(updateTypes.removeShell);
        if (updateTypes.removeWeapon)
            await queryRunner.manager.save(updateTypes.removeWeapon);
        if (updateTypes.addCloth)
            await queryRunner.manager.save(updateTypes.addCloth);
        if (updateTypes.addShell)
            await queryRunner.manager.save(updateTypes.addShell);
        if (updateTypes.addWeapon)
            await queryRunner.manager.save(updateTypes.addWeapon);
    }
}
