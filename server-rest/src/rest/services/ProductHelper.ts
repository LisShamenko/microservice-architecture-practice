import { Injectable } from "@nestjs/common";
import { clamp } from "lodash";
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
// 
import { ProductItemDto } from "../dto/ProductItemDto";
import { FillProductsDto } from "../dto/FillProductsDto";
import { ProductTypeOptions } from "../dto/ProductTypeOptions";
import { Product, ProductDocument } from "../../modules/Mongo/entity/Product";
import { ProductTypes } from "../../modules/Mongo/enums/ProductTypes";
import { InventoryProduct } from "../../modules/Mongo/Entity/Inventory";
import { ProductCloth, ProductShell, ProductWeapon } from "../../modules/Mongo/entity/Product";



// 
@Injectable()
export class ProductHelper {
    constructor(
        @InjectModel(Product.name, 'db')
        private productModel: Model<ProductDocument>,
    ) { }

    // 
    async refillProducts(tmpProducts: InventoryProduct[], products: FillProductsDto) {
        if (products) {
            await this.addProductsToList(tmpProducts, products.add);
            this.removeProductsFromList(tmpProducts, products.remove);
        }
    }

    async addProductsToList(tmpProducts: InventoryProduct[], idtoProducts: ProductItemDto[]) {
        if (!idtoProducts || idtoProducts.length <= 0) return;

        const product_ids = idtoProducts.map(p => new Types.ObjectId(p.product_id));
        const products = await this.productModel.find({
            _id: { $in: product_ids },
        });

        idtoProducts.forEach(idto_p => {
            const curProd = products.find(p => p.id === idto_p.product_id);

            if (curProd) {
                const tmpProd = tmpProducts.find(
                    p => p.product_id.toString() === idto_p.product_id
                );

                if (tmpProd) {
                    const sum = tmpProd.count_in_all_slots + idto_p.count_in_slots;
                    tmpProd.count_in_all_slots = clamp(sum, 0, curProd.max_in_slot);
                }
                else {
                    const count = clamp(idto_p.count_in_slots, 0, curProd.max_in_slot);
                    tmpProducts.push({
                        product_id: new Types.ObjectId(idto_p.product_id),
                        count_in_all_slots: count,
                    } as InventoryProduct);
                }
            }
        });
    }

    removeProductsFromList(tmpProducts: InventoryProduct[], idtoProducts: ProductItemDto[]) {
        if (!idtoProducts || idtoProducts.length <= 0) return;

        idtoProducts.forEach(idto_p => {
            const tmpProd = tmpProducts.find(
                p => p.product_id.toString() === idto_p.product_id
            );

            if (tmpProd) {
                const diff = tmpProd.count_in_all_slots - Math.abs(idto_p.count_in_slots);
                if (diff > 0) {
                    tmpProd.count_in_all_slots = diff;
                }
                else {
                    const ind = tmpProducts.indexOf(tmpProd);
                    tmpProducts.splice(ind, 1);
                }
            }
        });
    }

    // 
    async getProducts(ids?: string[]) {
        if (!ids) return [];

        const product_ids = ids.map(p => new Types.ObjectId(p));
        const products = await this.productModel.find({
            _id: { $in: product_ids },
        });

        return products.map(p => p.id);
    }

    async newProductShell(productId: Types.ObjectId, weapons: string[]) {
        const objectIds = await this.getProducts(weapons);

        const shell = {
            product_id: productId,
            weapons: objectIds,
        } as ProductShell;

        return shell;
    }

    async newProductWeapon(productId: Types.ObjectId, shells: string[]) {
        const objectIds = await this.getProducts(shells);

        const weapon = {
            product_id: productId,
            shells: objectIds,
        } as ProductWeapon;

        return weapon;
    }

    async newProductType(product: ProductDocument, typeOptions: ProductTypeOptions) {
        if (product.product_type === ProductTypes.none) return;

        // 
        if (product.product_type === ProductTypes.cloth) {
            product.cloth = {
                product_id: product._id,
            } as ProductCloth;
        }
        else if (product.product_type === ProductTypes.shell) {
            product.shell = await this.newProductShell(
                product._id, typeOptions?.shell?.weapons
            );
        }
        else if (product.product_type === ProductTypes.weapon) {
            product.weapon = await this.newProductWeapon(
                product._id, typeOptions?.weapon?.shells
            );
        }
    }

    async updateProductType(product: ProductDocument, typeOptions: ProductTypeOptions) {
        if (product.product_type === typeOptions.type) return;

        // 
        if (typeOptions.type === ProductTypes.none) {
            product.cloth = null;
            product.shell = null;
            product.weapon = null;
        }
        else if (typeOptions.type === ProductTypes.cloth) {
            product.cloth = {
                product_id: product._id,
            } as ProductCloth;
            product.shell = null;
            product.weapon = null;
        }
        else if (typeOptions.type === ProductTypes.shell) {
            product.cloth = null;
            product.shell = await this.newProductShell(
                product._id, typeOptions?.shell?.weapons
            );
            product.weapon = null;
        }
        else if (typeOptions.type === ProductTypes.weapon) {
            product.cloth = null;
            product.shell = null;
            product.weapon = await this.newProductWeapon(
                product._id, typeOptions?.weapon?.shells
            );
        }

        // 
        product.product_type = typeOptions.type;
    }
}

export const productMapCallback = (item: InventoryProduct) => {
    if (item.products && item.products.length > 0) {
        const product = item.products[0];
        return {
            count_in_slot: item.count_in_all_slots,
            title: product.title,
            price: product.price,
            max_in_slot: product.max_in_slot,
            requirements: product.requirements,
        }
    }
    return {
        count_in_slot: item.count_in_all_slots,
    }
}