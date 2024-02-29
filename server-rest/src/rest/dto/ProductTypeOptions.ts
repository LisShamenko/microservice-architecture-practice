import { ProductTypes } from "src/modules/Mongo/enums/ProductTypes";



// 
export class ProductTypeOptions {
    type: ProductTypes = ProductTypes.none;
    shell?: {
        weapons: string[];
    }
    weapon?: {
        shells: string[];
    }
}
