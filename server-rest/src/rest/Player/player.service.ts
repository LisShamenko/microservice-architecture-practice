import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
// 
import { InsertPlayerDto } from './dto/InsertPlayerDto';
import { UpdatePlayerDto } from './dto/UpdatePlayerDto';
import { Inventory } from '../../modules/Mongo/entity/Inventory';
import { LevelEffect, Player, PlayerDocument } from '../../modules/Mongo/entity/Player';
import { TemplateHelper } from '../services/TemplateHelper';
import { ProductHelper, productMapCallback } from '../services/ProductHelper';
import { PropertyHelper } from '../services/PropertyHelper';
import { SkillHelper } from '../services/SkillHelper';
import { LevelEffectsHelper } from '../services/LevelEffectsHelper';
import { ErrorHelper } from '../services/ErrorHelper';
import { Sorting } from 'src/modules/Mongo/enums/Sorting';
import { LevelTemplateModel } from 'src/modules/Mongo/Entity/LevelTemplate';



//
@Injectable()
export class PlayerService {
    constructor(
        @InjectModel(Player.name, 'db')
        private playerModel: Model<PlayerDocument>,
        private templateHelper: TemplateHelper,
        private productHelper: ProductHelper,
        private propertyHelper: PropertyHelper,
        private skillHelper: SkillHelper,
        private effectsHelper: LevelEffectsHelper,
        private errorHelper: ErrorHelper,
    ) { }

    // 
    async insertPlayer(idto: InsertPlayerDto) {

        const { tmpProperties, tmpProducts, tmpSkills } =
            await this.templateHelper.getTemplate(idto.level_template_id);

        this.propertyHelper.setProperties(tmpProperties, idto.delta_properties);
        await this.productHelper.refillProducts(tmpProducts, idto.products);
        await this.skillHelper.refillSkills(tmpSkills, idto.skills);

        const tmpEffects: LevelEffect[] = [];
        this.effectsHelper.addEffects(tmpEffects, idto.effects);

        // 
        const player: Player = {
            login: idto.login,
            password: idto.password,
            firstname: idto.firstname,
            secondname: idto.secondname,
            thirdname: idto.thirdname,
            email: idto.email,
            inventory: {
                sorting: Sorting.none,
                products: tmpProducts,
            } as Inventory,
            properties: tmpProperties,
            level_template_id: new Types.ObjectId(idto.level_template_id),
            level_effects: tmpEffects,
            skills: tmpSkills,
        } as Player;

        //
        const newPlayer = new this.playerModel(player);
        const result = await newPlayer.save();
        return { id: result.id };
    }

    // 
    async updatePlayer(player_id: string, udto: UpdatePlayerDto) {

        const player = await this.playerModel
            .where({ _id: player_id })
            .findOne();
        this.errorHelper.foundError(player, 'player_id');

        // 
        this.propertyHelper.setProperties(
            player.properties, udto.delta_properties
        );

        await this.productHelper.refillProducts(
            player.inventory.products, udto.products
        );

        await this.skillHelper.refillSkills(
            player.skills, udto.skills
        );

        this.effectsHelper.addEffects(
            player.level_effects, udto.effects.add
        );

        if (udto.firstname) player.firstname = udto.firstname;
        if (udto.secondname) player.secondname = udto.secondname;
        if (udto.thirdname) player.thirdname = udto.thirdname;
        if (udto.email) player.email = udto.email;

        // 
        const result = await player.save();
        return { id: result.id };
    }

    // 
    async deletePlayer(player_id: string) {
        try {
            const result = await this.playerModel
                .deleteOne({ _id: player_id });
            return { rows: result.deletedCount };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }

    // 
    async getOnePlayer(player_id: string) {
        const player = await this.playerModel
            .where({ _id: new Types.ObjectId(player_id) })
            .populate('inventory.products.products')
            .populate({ path: 'player_level', model: LevelTemplateModel })
            .findOne();
        this.errorHelper.foundError(player, 'player_id');

        return {
            id: player.id,
            login: player.login,
            inventory: {
                sorting: player.inventory.sorting,
                products: player.inventory.products.map(productMapCallback),
            },
            properties: player.properties,
            template: {
                id: player.level_template_id,
                title: player.player_level[0].title,
            },
            skills: player.skills,
            effects: player.level_effects.map(e => ({
                id: e._id.toString(),
                count_matches: e.count_matches,
                is_equipment: e.is_equipment,
                property_column: e.property_column,
                delta_value: e.delta_value,
            }))
        };
    }

    // 
    async getAllPlayers() {
        const players = await this.playerModel
            .find();

        return {
            players: (!players) ? [] : players.map(player => ({
                id: player.id,
                login: player.login,
            }))
        }
    }
}
