import { ActivityPoint } from './ActivityPoint';
import { ActivitySpawn } from './ActivitySpawn';
import { ActivityTeleport } from './ActivityTeleport';
import { Enemy } from './Enemy';
import { EnemySkill } from './EnemySkill';
import { Game } from './Game';
import { GamePlayer } from './GamePlayer';
import { Inventory } from './Inventory';
import { InventoryProduct } from './InventoryProduct';
import { LevelEffect } from './LevelEffect';
import { LevelTemplate } from './LevelTemplate';
import { LevelTemplateSkill } from './LevelTemplateSkill';
import { Map } from './Map';
import { MapPoint } from './MapPoint';
import { Player } from './Player';
import { PlayerProperty } from './PlayerProperty';
import { PlayerSkill } from './PlayerSkill';
import { Product } from './Product';
import { ProductCloth } from './ProductCloth';
import { ProductShell } from './ProductShell';
import { ProductSkill } from './ProductSkill';
import { ProductWeapon } from './ProductWeapon';
import { Requirement } from './Requirement';
import { Skill } from './Skill';
import { SpawnScript } from './SpawnScript';
import { SpawnScriptEnemy } from './SpawnScriptEnemy';
import { TestModel } from './TestModel';
import { User } from './User';
import { UserFile } from './UserFile';
import { WeaponShell } from './WeaponShell';

// 
export const dbEntities = [
    PlayerProperty, Requirement, Skill, Inventory, LevelTemplate,
    LevelTemplateSkill, Player, Enemy, LevelEffect, PlayerSkill,
    Product, ProductSkill, ProductWeapon, ProductCloth, ProductShell,
    WeaponShell, InventoryProduct, Map, ActivityPoint, MapPoint,
    SpawnScript, SpawnScriptEnemy, Game, GamePlayer, ActivitySpawn,
    ActivityTeleport, EnemySkill, User, UserFile,
];

// 
export const admin = {
    TestModel,
    entities: [
        TestModel
    ],
};

// 
export const allEntities = [...dbEntities, ...admin.entities];
