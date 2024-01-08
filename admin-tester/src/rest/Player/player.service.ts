import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { DataSource } from 'typeorm';
// 
import { InsertPlayerDto } from './dto/InsertPlayerDto';
import { UpdatePlayerDto } from './dto/UpdatePlayerDto';
import { Inventory } from 'src/modules/Postgres/entity/Inventory';
import { Player } from 'src/modules/Postgres/entity/Player';
import { LevelEffect } from 'src/modules/Postgres/entity/LevelEffect';
import { TemplateHelper } from '../services/TemplateHelper';
import { ProductHelper } from '../services/ProductHelper';
import { PropertyHelper } from '../services/PropertyHelper';
import { SkillHelper } from '../services/SkillHelper';
import { LevelEffectsHelper } from '../services/LevelEffectsHelper';
import { ErrorHelper } from '../services/ErrorHelper';

//
@Injectable()
export class PlayerService {
    constructor(
        @InjectDataSource('postgres_db') private dataSource: DataSource,
        private templateHelper: TemplateHelper,
        private productHelper: ProductHelper,
        private propertyHelper: PropertyHelper,
        private skillHelper: SkillHelper,
        private effectsHelper: LevelEffectsHelper,
        private errorHelper: ErrorHelper,
    ) { }

    // 
    async insertPlayer(idto: InsertPlayerDto) {

        const tmp = await this.templateHelper.getPalyerTemplate(
            idto.level_template_id);
        this.errorHelper.foundError(tmp, 'level_template_id');

        this.propertyHelper.setProperties(tmp.properties, idto.delta_properties);
        await this.productHelper.refillProducts(tmp.products, idto.products);
        await this.skillHelper.refillPlayerSkills(tmp.skills, idto.skills);

        // 
        const tmpEffects: LevelEffect[] = [];
        this.effectsHelper.addEffects(tmpEffects, idto.effects);

        // 
        const inventory: Inventory = new Inventory();
        inventory.products = [];

        const player: Player = new Player();
        player.login = idto.login;
        player.password = idto.password;
        player.firstname = idto.firstname;
        player.secondname = idto.secondname;
        player.thirdname = idto.thirdname;
        player.email = idto.email;
        player.inventory = inventory;
        player.playerProperty = tmp.properties;
        player.level_template_id = idto.level_template_id;
        player.skills = [];
        player.skills.push(...tmp.skills);
        player.effects = tmpEffects;

        //
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(tmp.properties);

            await queryRunner.manager.save(player.inventory);

            if (tmp.products.length > 0) {
                tmp.products.forEach(p => {
                    p.id = null;
                    p.inventory_id = player.inventory.id;
                });
                player.inventory.products.push(...tmp.products);
                await queryRunner.manager.save(tmp.products);
            }

            player.properties_id = tmp.properties.id;
            player.inventory_id = player.inventory.id;
            await queryRunner.manager.save(player);

            if (tmp.skills.length > 0) {
                tmp.skills.forEach(s => { s.player_id = player.id });
                await queryRunner.manager.save(player.skills);
            }

            if (tmpEffects.length > 0) {
                tmpEffects.forEach(e => { e.player_id = player.id });
                await queryRunner.manager.save(tmpEffects);
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
        return { id: player.id };
    }

    // 
    async updatePlayer(player_id: number, udto: UpdatePlayerDto) {

        const player = await this.dataSource.getRepository(Player).findOne({
            where: {
                id: player_id,
            },
            relations: {
                playerProperty: true,
                inventory: {
                    products: {
                        product: true,
                    }
                },
                skills: true,
                effects: true,
            },
        });
        this.errorHelper.foundError(player, 'player_id');

        // 
        this.propertyHelper.setProperties(player.playerProperty, udto.delta_properties);

        const tmpProducts = player.inventory.products;
        await this.productHelper.refillProducts(tmpProducts, udto.products);

        const tmpSkills = player.skills;
        const removeSkills = this.skillHelper.filterSkills(tmpSkills, udto.skills);
        await this.skillHelper.refillPlayerSkills(tmpSkills, udto.skills);

        //
        const addProducts = tmpProducts.filter(p => p.count_in_all_slots > 0);
        const removeProducts = tmpProducts.filter(p => (
            p.id && p.count_in_all_slots <= 0
        ));
        const addSkills = tmpSkills;

        // 
        const addEffects: LevelEffect[] = [];
        this.effectsHelper.addEffects(addEffects, udto.effects.add);
        const removeEffects = this.effectsHelper.getRemoveEffects(
            player.effects, udto.effects.remove);

        // 
        if (udto.firstname) player.firstname = udto.firstname;
        if (udto.secondname) player.secondname = udto.secondname;
        if (udto.thirdname) player.thirdname = udto.thirdname;
        if (udto.email) player.email = udto.email;
        player.inventory.products = addProducts;
        player.skills = addSkills;

        // 
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            await queryRunner.manager.save(player.playerProperty);

            if (removeProducts.length > 0) {
                await queryRunner.manager.remove(removeProducts);
            }

            if (addProducts.length > 0) {
                addProducts.forEach(p => {
                    //p.id = null;
                    p.inventory_id = player.inventory.id;
                });
                await queryRunner.manager.save(addProducts);
            }

            if (removeSkills.length > 0) {
                await queryRunner.manager.remove(removeSkills);
            }

            if (addSkills.length > 0) {
                addSkills.forEach(s => { s.player_id = player.id });
                await queryRunner.manager.save(player.skills);
            }

            if (removeEffects.length > 0) {
                await queryRunner.manager.remove(removeEffects);
            }

            if (addEffects.length > 0) {
                addEffects.forEach(e => { e.player_id = player.id });
                await queryRunner.manager.save(addEffects);
                addEffects.forEach(e => player.effects.push(e));
            }

            await queryRunner.manager.save(player);

            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            this.errorHelper.transactionError(err.message);
        }
        finally {
            await queryRunner.release();
        }
        return { id: player.id };
    }

    // 
    async deletePlayer(player_id: number) {
        try {
            const result = await this.dataSource.getRepository(Player)
                .delete({ id: player_id });
            return { rows: result.affected };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }

    // 
    async getOnePlayer(player_id: number) {
        const player = await this.dataSource.getRepository(Player).findOne({
            where: {
                id: player_id,
            },
            relations: {
                inventory: {
                    products: {
                        product: true,
                    },
                },
                playerProperty: true,
                levelTemplate: true,
                skills: true,
                effects: true,
            },
        });
        this.errorHelper.foundError(player, 'player_id');

        return {
            id: player.id,
            login: player.login,
            inventory: {
                sorting: player.inventory.sorting,
                products: player.inventory.products.map(item => ({
                    count_in_slot: item.count_in_all_slots,
                    title: item.product.title,
                    price: item.product.price,
                    max_in_slot: item.product.max_in_slot,
                    requirement_id: item.product.requirement_id,
                })),
            },
            properties: omit(player.playerProperty, 'id'),
            template: {
                title: player.levelTemplate.title,
            },
            skills: player.skills.map(s => s.skill_id),
            effects: player.effects.map(e => ({
                id: e.id,
                count_matches: e.count_matches,
                is_equipment: e.is_equipment,
                property_column: e.property_column,
                delta_value: e.delta_value,
            }))
        };
    }

    // 
    async getAllPlayers() {
        const players = await this.dataSource.getRepository(Player).find();
        return {
            players: (!players) ? [] : players.map(player => ({
                id: player.id,
                login: player.login,
            }))
        }
    }
}
