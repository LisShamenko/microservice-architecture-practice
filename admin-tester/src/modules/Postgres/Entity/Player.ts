import { BaseEntity, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './Game';
//
import { GamePlayer } from './GamePlayer';
import { Inventory } from './Inventory';
import { LevelEffect } from './LevelEffect';
import { LevelTemplate } from './LevelTemplate';
import { PlayerProperty } from './PlayerProperty';
import { PlayerSkill } from './PlayerSkill';

//
@Entity('players')
export class Player extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() login: string;
    @Column() password: string;
    @Column() firstname: string;
    @Column() secondname: string;
    @Column() thirdname: string;
    @Column() email: string;
    @Column() inventory_id: number;
    @Column() properties_id: number;
    @Column() level_template_id: number;

    //
    @OneToOne(() => Inventory, (inventory) => inventory.player)
    @JoinColumn({ name: 'inventory_id', referencedColumnName: 'id' })
    public inventory: Inventory;

    @OneToOne(() => PlayerProperty, (playerProperty) => playerProperty.player)
    @JoinColumn({ name: 'properties_id', referencedColumnName: 'id' })
    public playerProperty: PlayerProperty;

    @OneToOne(() => LevelTemplate, (levelTemplate) => levelTemplate.player)
    @JoinColumn({ name: 'level_template_id', referencedColumnName: 'id' })
    public levelTemplate: LevelTemplate;

    //
    @OneToMany(() => LevelEffect, (effect) => effect.player)
    public effects: LevelEffect[];

    @OneToMany(() => GamePlayer, (gamePlayer) => gamePlayer.player)
    public games: GamePlayer[];

    @OneToMany(() => PlayerSkill, (playerSkill) => playerSkill.player)
    public skills: PlayerSkill[];

    @OneToOne(() => Game, (game) => game.ownerPlayer)
    public game: Game;
}
