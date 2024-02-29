import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
//
import { InsertEnemyDto } from './dto/InsertEnemyDto';
import { UpdateEnemyDto } from './dto/UpdateEnemyDto';
import { Enemy, EnemyDocument } from '../../modules/Mongo/entity/Enemy';
import { Inventory } from '../../modules/Mongo/entity/Inventory';
import { ProductHelper, productMapCallback } from '../services/ProductHelper';
import { PropertyHelper } from '../services/PropertyHelper';
import { SkillHelper } from '../services/SkillHelper';
import { TemplateHelper } from '../services/TemplateHelper';
import { ErrorHelper } from '../services/ErrorHelper';
import { Sorting } from 'src/modules/Mongo/enums/Sorting';



//
@Injectable()
export class EnemyService {
    constructor(
        @InjectModel(Enemy.name, 'db')
        private enemyModel: Model<EnemyDocument>,
        private errorHelper: ErrorHelper,
        private templateHelper: TemplateHelper,
        private productHelper: ProductHelper,
        private propertyHelper: PropertyHelper,
        private skillHelper: SkillHelper,
    ) { }

    // 
    async insertEnemy(idto: InsertEnemyDto) {

        const { tmpProperties, tmpProducts, tmpSkills } =
            await this.templateHelper.getTemplate(idto.level_template_id);

        this.propertyHelper.setProperties(tmpProperties, idto.delta_properties);
        await this.productHelper.refillProducts(tmpProducts, idto.products);
        await this.skillHelper.refillSkills(tmpSkills, idto.skills);

        // 
        const enemy: Enemy = {
            enemy_type: idto.enemy_type,
            nickname: idto.nickname,
            inventory: {
                sorting: Sorting.none,
                products: tmpProducts,
            } as Inventory,
            properties: tmpProperties,
            level_template_id: new Types.ObjectId(idto.level_template_id),
            skills: tmpSkills,
        } as Enemy;

        //
        const newEnemy = new this.enemyModel(enemy);
        const result = await newEnemy.save();
        return { id: result.id };
    }

    // 
    async updateEnemy(enemy_id: string, udto: UpdateEnemyDto) {

        const enemy = await this.enemyModel
            .where({ _id: enemy_id })
            .findOne();
        this.errorHelper.foundError(enemy, 'enemy_id');

        //      udto.reset_template_id !== enemy.level_template_id.toString()
        if (udto.reset_template_id) {
            enemy.level_template_id = new Types.ObjectId(udto.reset_template_id);

            const { tmpProperties, tmpProducts, tmpSkills } =
                await this.templateHelper.getTemplate(udto.reset_template_id);

            this.propertyHelper.setProperties(
                tmpProperties, udto.delta_properties
            );

            await this.productHelper.refillProducts(
                tmpProducts, udto.products
            );

            await this.skillHelper.refillSkills(
                tmpSkills, udto.skills
            );

            enemy.properties = tmpProperties;
            enemy.inventory = {
                sorting: Sorting.none,
                products: tmpProducts,
            } as Inventory;
            enemy.skills = tmpSkills;
        }
        else {

            this.propertyHelper.setProperties(
                enemy.properties, udto.delta_properties
            );

            await this.productHelper.refillProducts(
                enemy.inventory.products, udto.products
            );

            await this.skillHelper.refillSkills(
                enemy.skills, udto.skills
            );
        }

        if (udto.enemy_type) enemy.enemy_type = udto.enemy_type;
        if (udto.nickname) enemy.nickname = udto.nickname;

        // 
        const result = await enemy.save();
        return { id: result.id };
    }

    // 
    async deleteEnemy(enemy_id: string) {
        try {
            const result = await this.enemyModel
                .deleteOne({ _id: enemy_id });
            return { rows: result.deletedCount };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }

    // 
    async getOneEnemy(enemy_id: string) {
        const enemy = await this.enemyModel
            .where({ _id: enemy_id })
            //      .populate({
            //          path: 'level_template',
            //          localField: 'level_template_id',
            //          model: LevelTemplateModel,
            //          foreignField: '_id',
            //      })
            .populate('level_template')
            .populate('inventory.products.products')
            .findOne();
        this.errorHelper.foundError(enemy, 'enemy_id');

        return {
            id: enemy.id,
            nickname: enemy.nickname,
            enemy_type: enemy.enemy_type,
            inventory: {
                sorting: enemy.inventory.sorting,
                products: enemy.inventory.products.map(productMapCallback),
            },
            properties: enemy.properties,
            template: {
                id: enemy.level_template_id,
                title: enemy.level_template[0].title,
            },
            skills: enemy.skills,
        };
    }

    // 
    async getAllEnemies() {
        const enemies = await this.enemyModel
            .find();

        return {
            enemies: (!enemies) ? [] : enemies.map(enemy => ({
                id: enemy.id,
                nickname: enemy.nickname,
            }))
        }
    }
}
