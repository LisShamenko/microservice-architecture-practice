import { BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
// 
import { Game } from './Game';
import { GamePlayer } from './GamePlayer';
import { Inventory } from './Inventory';
import { LevelEffect } from './LevelEffect';
import { LevelTemplate } from './LevelTemplate';
import { PlayerProperty } from './PlayerProperty';
import { PlayerSkill } from './PlayerSkill';
import { Skill } from './Skill';

//
@Table({ tableName: 'players' })
export class Player extends Model {
    @Column({ primaryKey: true, autoIncrement: true }) id: number;
    @Column({}) login: string;
    @Column({}) password: string;
    @Column({}) firstname: string;
    @Column({}) secondname: string;
    @Column({}) thirdname: string;
    @Column({}) email: string;
    @Column({}) inventory_id: number;
    @Column({}) properties_id: number;
    @Column({}) level_template_id: number;

    //
    @BelongsTo(() => Inventory, 'inventory_id') inventory: Inventory;
    @BelongsTo(() => PlayerProperty, 'properties_id') playerProperty: PlayerProperty;
    @BelongsTo(() => LevelTemplate, 'level_template_id') levelTemplate: LevelTemplate;

    //
    @HasMany(() => LevelEffect, 'player_id') effects: LevelEffect[];
    @HasOne(() => Game, 'owner_player_id') game: Game;

    // 
    @HasMany(() => GamePlayer, 'player_id') linkGamePlayer: GamePlayer[];
    @BelongsToMany(() => Game, () => GamePlayer) games: Game[];

    @HasMany(() => PlayerSkill, 'player_id') linkPlayerSkill: PlayerSkill[];
    @BelongsToMany(() => Skill, () => PlayerSkill) skills: Skill[];
}
