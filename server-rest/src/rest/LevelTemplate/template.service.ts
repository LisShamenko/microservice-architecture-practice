import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
//
import { InsertTemplateDto } from './dto/InsertTemplateDto';
import { UpdateTemplateDto } from './dto/UpdateTemplateDto';
import { ProductHelper, productMapCallback } from '../services/ProductHelper';
import { PropertyHelper } from '../services/PropertyHelper';
import { SkillHelper } from '../services/SkillHelper';
import { ErrorHelper } from '../services/ErrorHelper';
import { LevelTemplate, LevelTemplateDocument } from '../../modules/Mongo/Entity/LevelTemplate';
import { PlayerProperty } from '../../modules/Mongo/Entity/PlayerProperty';
import { Inventory, InventoryProduct } from '../../modules/Mongo/Entity/Inventory';
import { Sorting } from '../../modules/Mongo/enums/Sorting';



//
@Injectable()
export class TemplateService {
    constructor(
        @InjectModel(LevelTemplate.name, 'db')
        private levelTemplateModel: Model<LevelTemplateDocument>,
        private productHelper: ProductHelper,
        private propertiesHelper: PropertyHelper,
        private skillHelper: SkillHelper,
        private errorHelper: ErrorHelper,
    ) { }

    // 
    async insertTemplate(idto: InsertTemplateDto) {

        const properties = new PlayerProperty();
        this.propertiesHelper.setProperties(properties, idto.properties);

        const tmpProducts: InventoryProduct[] = [];
        await this.productHelper.addProductsToList(
            tmpProducts, idto.products
        );

        const tmpSkills: string[] = [];
        await this.skillHelper.addSkills(tmpSkills, idto.skills);

        const levelTemplate: LevelTemplate = {
            title: idto.title,
            coins: idto.coins,
            properties: properties,
            inventory: {
                sorting: Sorting.none,
                products: tmpProducts,
            } as Inventory,
            skills: tmpSkills,
        } as LevelTemplate;

        // 
        const newTemplate = new this.levelTemplateModel(levelTemplate);
        const result = await newTemplate.save();
        return { id: result.id };
    }

    // 
    async updateTemplate(template_id: string, udto: UpdateTemplateDto) {

        const levelTemplate = await this.levelTemplateModel
            .where({ _id: template_id })
            .findOne();
        this.errorHelper.foundError(levelTemplate, 'template_id');

        // 
        this.propertiesHelper.setProperties(
            levelTemplate.properties,
            udto.delta_properties,
        );

        await this.productHelper.refillProducts(
            levelTemplate.inventory.products,
            udto.products
        );

        await this.skillHelper.refillSkills(
            levelTemplate.skills, udto.skills
        );

        if (udto.title) levelTemplate.title = udto.title;
        if (udto.coins) levelTemplate.coins = udto.coins;

        // 
        const result = await levelTemplate.save();
        return { id: result.id };
    }

    // 
    async deleteTemplate(template_id: string) {
        try {
            const result = await this.levelTemplateModel
                .deleteOne({ _id: template_id });
            return { rows: result.deletedCount };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }

    // 
    async getOneTemplate(template_id: string) {

        const template = await this.levelTemplateModel
            .where({ _id: new Types.ObjectId(template_id) })
            .populate('inventory.products.products')
            .findOne();
        this.errorHelper.foundError(template, 'template_id');

        return {
            id: template.id,
            title: template.title,
            coins: template.coins,
            properties: omit(template.properties, 'id'),
            inventory: {
                sorting: template.inventory.sorting,
                products: template.inventory.products.map(productMapCallback),
            },
            skills: template.skills,
        };
    }

    // 
    async getAllTemplates() {
        const templates = await this.levelTemplateModel
            .find();

        return {
            templates: (!templates) ? [] : templates.map(template => ({
                id: template.id,
                title: template.title,
            }))
        }
    }
}
