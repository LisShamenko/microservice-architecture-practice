import { Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { PaginatorArgs } from 'nestjs-graphql-tools';
// 
import { Player } from '../../../modules/Postgres/entity/Player';
import { LevelEffect } from '../../../modules/Postgres/entity/LevelEffect';
import { Inventory } from '../../../modules/Postgres/entity/Inventory';
import { InventoryProduct } from '../../../modules/Postgres/entity/InventoryProduct';
import { PlayerSkill } from '../../../modules/Postgres/entity/PlayerSkill';
import { Sorting } from '../../../modules/Postgres/enums/Sorting';
import { TemplateHelper } from '../services/TemplateHelper';
import { ProductHelper } from '../services/ProductHelper';
import { PropertyHelper } from '../services/PropertyHelper';
import { SkillHelper } from '../services/SkillHelper';
import { LevelEffectsHelper } from '../services/LevelEffectsHelper';
import { ErrorHelper } from '../services/ErrorHelper';
import { NewPlayerInput, PlayerObject, UpdatePlayerInput } from './player.objects';



// 
@Injectable()
export class PlayerService {
    private repoPlayer: Repository<Player>;
    private repoInventoryProduct: Repository<InventoryProduct>;
    private repoPlayerSkill: Repository<PlayerSkill>;
    private repoLevelEffect: Repository<LevelEffect>;

    constructor(
        private sequelize: Sequelize,
        private templateHelper: TemplateHelper,
        private productHelper: ProductHelper,
        private propertyHelper: PropertyHelper,
        private skillHelper: SkillHelper,
        private effectsHelper: LevelEffectsHelper,
        private errorHelper: ErrorHelper,
    ) {
        this.repoPlayer = this.sequelize.getRepository(Player);
        this.repoInventoryProduct = this.sequelize.getRepository(InventoryProduct);
        this.repoPlayerSkill = this.sequelize.getRepository(PlayerSkill);
        this.repoLevelEffect = this.sequelize.getRepository(LevelEffect);
    }

    // 
    async insertPlayer(idto: NewPlayerInput) {

        const { tmpProperties, tmpProducts, tmpSkills } =
            await this.templateHelper.getPalyerTemplate(idto.level_template_id);

        this.propertyHelper.deltaProperties(tmpProperties, idto.delta_properties);
        await this.productHelper.refillProducts(tmpProducts, idto.products);
        await this.skillHelper.refillPlayerSkills(tmpSkills, idto.skills);

        const tmpEffects: LevelEffect[] = [];
        this.effectsHelper.addEffects(tmpEffects, idto.effects);

        // 
        const inventory = new Inventory();
        inventory.sorting = Sorting.none;

        const player: Player = new Player();
        player.login = idto.login;
        player.password = idto.password;
        player.firstname = idto.firstname;
        player.secondname = idto.secondname;
        player.thirdname = idto.thirdname;
        player.email = idto.email;
        player.level_template_id = idto.level_template_id;

        // 
        const t = await this.sequelize.transaction();
        try {

            await tmpProperties.save({ transaction: t });
            player.properties_id = tmpProperties.id;

            await inventory.save({ transaction: t });
            player.inventory_id = inventory.id;

            if (tmpProducts.length > 0) {
                for (const p of tmpProducts) {
                    p.inventory_id = inventory.id;
                    await p.save({ transaction: t });
                }
            }

            await player.save({ transaction: t });

            if (tmpSkills.length > 0) {
                for (const s of tmpSkills) {
                    s.player_id = player.id;
                    await s.save({ transaction: t });
                }
            }

            if (tmpEffects.length > 0) {
                for (const e of tmpEffects) {
                    e.player_id = player.id;
                    await e.save({ transaction: t });
                }
            }

            await t.commit();
            return player;
        }
        catch (err) {
            await t.rollback();
            this.errorHelper.transactionError(err.message);
        }
    }

    async updatePlayer(udto: UpdatePlayerInput) {

        const player = await this.repoPlayer.findOne({
            where: {
                id: udto.player_id,
            },
            include: [
                { association: 'playerProperty' },
                { association: 'inventory', include: ['linkInventoryProduct'] },
                { association: 'linkPlayerSkill' },
                { association: 'effects' },
            ],
        });
        this.errorHelper.foundError(player, 'player_id');

        // 
        this.propertyHelper.deltaProperties(player.playerProperty, udto.delta_properties);

        const tmpProducts = player.inventory.linkInventoryProduct;
        await this.productHelper.refillProducts(tmpProducts, udto.products);

        const tmpSkills = player.linkPlayerSkill;
        const removeSkills = this.skillHelper.filterSkills(tmpSkills, udto.skills);
        await this.skillHelper.refillPlayerSkills(tmpSkills, udto.skills);

        const addProducts = tmpProducts.filter(p => p.count_in_all_slots > 0);
        const removeProducts = tmpProducts.filter(p => (
            (p.id >= 0) && p.count_in_all_slots <= 0
        ));
        const addSkills = tmpSkills;

        const addEffects: LevelEffect[] = [];
        this.effectsHelper.addEffects(addEffects, udto.add_effects);
        const removeEffects = this.effectsHelper.getRemoveEffects(
            player.effects, udto.remove_effects);

        // 
        if (udto.firstname) player.firstname = udto.firstname;
        if (udto.secondname) player.secondname = udto.secondname;
        if (udto.thirdname) player.thirdname = udto.thirdname;
        if (udto.email) player.email = udto.email;

        // 
        const t = await this.sequelize.transaction();
        try {

            await this.repoInventoryProduct.destroy({
                where: { id: removeProducts.map(p => p.id) },
                transaction: t,
            });
            if (addProducts.length > 0) {
                for (const p of addProducts) {
                    p.inventory_id = player.inventory.id;
                    await p.save({ transaction: t });
                }
            }

            await this.repoPlayerSkill.destroy({
                where: { id: removeSkills.map(s => s.id) },
                transaction: t,
            });
            if (addSkills.length > 0) {
                for (const s of addSkills) {
                    s.player_id = player.id
                    await s.save({ transaction: t });
                }
            }

            await this.repoLevelEffect.destroy({
                where: { id: removeEffects.map(e => e.id) },
                transaction: t,
            });
            if (addEffects.length > 0) {
                for (const e of addEffects) {
                    e.player_id = player.id;
                    await e.save({ transaction: t });
                }
            }

            await player.playerProperty.save();
            await player.save({ transaction: t });

            await t.commit();
        }
        catch (err) {
            await t.rollback();
            this.errorHelper.transactionError(err.message);
        }
        return player;
    }

    async getOnePlayer(player_id: number): Promise<PlayerObject> {
        return await this.repoPlayer.findOne({ where: { id: player_id } });
    }

    async getAllPlayers(paginator: PaginatorArgs): Promise<PlayerObject[]> {
        if (paginator) {
            return await this.repoPlayer.findAll({
                offset: paginator.page * paginator.per_page,
                limit: paginator.per_page,
            });
        }
        return await this.repoPlayer.findAll();
    }

    async deletePlayer(player_id: number) {
        try {
            const result = await this.repoPlayer.destroy({
                where: { id: player_id },
                force: true,
            });
            return { rows: result };
        }
        catch (err) {
            this.errorHelper.deleteError(err.message);
        }
    }
}
