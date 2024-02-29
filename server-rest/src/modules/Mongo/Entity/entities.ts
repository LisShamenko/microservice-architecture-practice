const mongooseAutopopulate = require('mongoose-autopopulate');
//
import { Skill, SkillSchema } from "./Skill";
import { LevelTemplate, LevelTemplateSchema } from "./LevelTemplate";
import { Product, ProductSchema } from "./Product";
import { Player, PlayerSchema } from "./Player";
import { Enemy, EnemySchema } from "./Enemy";
import { Game, GameSchema } from "./Game";
import { SpawnScript, SpawnScriptSchema } from "./SpawnScript";
import { Map, MapSchema } from "./Map";



// 
export const SkillFactory = {
    name: Skill.name,
    collection: 'skills',
    useFactory: () => {
        SkillSchema.plugin(mongooseAutopopulate);
        return SkillSchema;
    },
};

export const LevelTemplateFactory = {
    name: LevelTemplate.name,
    //collection: 'levelTemplates',
    useFactory: () => {
        LevelTemplateSchema.plugin(mongooseAutopopulate);
        return LevelTemplateSchema;
    },
};

export const ProductFactory = {
    name: Product.name,
    collection: 'products',
    useFactory: () => {
        ProductSchema.plugin(mongooseAutopopulate);
        return ProductSchema;
    },
};

export const PlayerFactory = {
    name: Player.name,
    collection: 'players',
    useFactory: () => {
        PlayerSchema.plugin(mongooseAutopopulate);
        return PlayerSchema;
    },
};

export const EnemyFactory = {
    name: Enemy.name,
    collection: 'enemies',
    useFactory: () => {
        EnemySchema.plugin(mongooseAutopopulate);
        return EnemySchema;
    },
};

export const GameFactory = {
    name: Game.name,
    collection: 'games',
    useFactory: () => {
        GameSchema.plugin(mongooseAutopopulate);
        return GameSchema;
    },
};

export const SpawnScriptFactory = {
    name: SpawnScript.name,
    //collection: 'spawnScripts',
    useFactory: () => {
        SpawnScriptSchema.plugin(mongooseAutopopulate);
        return SpawnScriptSchema;
    },
};

export const MapFactory = {
    name: Map.name,
    collection: 'maps',
    useFactory: () => {
        MapSchema.plugin(mongooseAutopopulate);
        return MapSchema;
    },
};

export const entityFactories = [
    SkillFactory,
    LevelTemplateFactory,
    ProductFactory,
    PlayerFactory,
    EnemyFactory,
    GameFactory,
    SpawnScriptFactory,
    MapFactory,
];
