import { Injectable } from "@nestjs/common";
import { clamp } from "lodash";
// 
import { InventoryProduct } from "../../../modules/Postgres/entity/InventoryProduct";
import { Product } from "../../../modules/Postgres/entity/Product";
import { ProductTypes } from "../../../modules/Postgres/enums/ProductTypes";
import { ProductCloth } from "../../../modules/Postgres/entity/ProductCloth";
import { ProductShell } from "../../../modules/Postgres/entity/ProductShell";
import { ProductWeapon } from "../../../modules/Postgres/entity/ProductWeapon";
import { FillProductsInput, ProductItemInput } from "../Enemy/enemy.objects";
import { Repository, Sequelize } from "sequelize-typescript";
import { Transaction } from "sequelize";

// 
export interface IProductInserts {
    addCloth: ProductCloth;
    addShell: ProductShell;
    addWeapon: ProductWeapon;
}

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
    private repoProduct: Repository<Product>;

    constructor(private sequelize: Sequelize) {
        this.repoProduct = this.sequelize.getRepository(Product);
    }

    async refillProducts(tmpProducts: InventoryProduct[], products: FillProductsInput) {
        if (products) {
            await this.addProductsToList(tmpProducts, products.add);
            this.removeProductsFromList(tmpProducts, products.remove);
        }
    }

    async addProductsToList(tmpProducts: InventoryProduct[], idtoProducts: ProductItemInput[]) {
        if (!idtoProducts || idtoProducts.length <= 0) return;

        const product_ids = idtoProducts.map(p => p.product_id);
        const products = await this.repoProduct.findAll({
            where: { id: product_ids }
        });

        idtoProducts.forEach(idto_p => {
            const curProd = products.find(p => p.id === idto_p.product_id);

            if (curProd) {
                const tmpProd = tmpProducts.find(
                    p => p.product_id === idto_p.product_id
                );

                if (tmpProd) {
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

    removeProductsFromList(tmpProducts: InventoryProduct[], idtoProducts: ProductItemInput[]) {
        if (!idtoProducts || idtoProducts.length <= 0) return;

        idtoProducts.forEach(idto_p => {
            const tmpProd = tmpProducts.find(p => p.product_id === idto_p.product_id);
            if (tmpProd) {
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

    async insertCloth(cloth: ProductCloth, product_id: number, t: Transaction) {
        if (cloth) {
            cloth.product_id = product_id;
            await cloth.save({ transaction: t });
        }
    }

    async insertShell(shell: ProductShell, product_id: number, t: Transaction) {
        if (shell) {
            shell.product_id = product_id;
            await shell.save({ transaction: t });
        }
    }

    async insertWeapon(weapon: ProductWeapon, product_id: number, t: Transaction) {
        if (weapon) {
            weapon.product_id = product_id;
            await weapon.save({ transaction: t });
        }
    }

    async updateTypes(updateTypes: IProductUpdates, t: Transaction) {
        if (updateTypes.removeCloth) await updateTypes.removeCloth.destroy({ transaction: t });
        if (updateTypes.removeShell) await updateTypes.removeShell.destroy({ transaction: t });
        if (updateTypes.removeWeapon) await updateTypes.removeWeapon.destroy({ transaction: t });
        if (updateTypes.addCloth) await updateTypes.addCloth.save({ transaction: t });
        if (updateTypes.addShell) await updateTypes.addShell.save({ transaction: t });
        if (updateTypes.addWeapon) await updateTypes.addWeapon.save({ transaction: t });
    }
}
