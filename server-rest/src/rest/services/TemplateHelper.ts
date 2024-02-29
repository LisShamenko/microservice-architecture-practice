import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// 
import { LevelTemplate, LevelTemplateDocument } from "../../modules/Mongo/entity/LevelTemplate";
import { ErrorHelper } from "./ErrorHelper";
import { PropertyHelper } from "./PropertyHelper";
import { InventoryProduct } from "src/modules/Mongo/Entity/Inventory";



// 
@Injectable()
export class TemplateHelper {
    constructor(
        @InjectModel(LevelTemplate.name, 'db')
        private levelTemplateModel: Model<LevelTemplateDocument>,
        private propertyHelper: PropertyHelper,
        private errorHelper: ErrorHelper,
    ) { }

    // 
    async getTemplate(level_template_id: string) {

        const template = await this.levelTemplateModel
            .where({ _id: level_template_id })
            .findOne();
        this.errorHelper.foundError(template, 'level_template_id');

        const tmpProperties = this.propertyHelper.newProperties(
            template.properties
        );

        const tmpProducts: InventoryProduct[] = [];
        template.inventory.products.forEach(p => {
            tmpProducts.push({
                product_id: p.product_id,
                count_in_all_slots: p.count_in_all_slots,
            } as InventoryProduct);
        });

        const tmpSkills: string[] = [];
        template.skills.forEach(s => tmpSkills.push(s));

        return { tmpProperties, tmpProducts, tmpSkills };
    }
}
