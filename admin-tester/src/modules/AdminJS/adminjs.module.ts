import { DynamicModule, Inject, Module } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule, AdminModuleOptions } from '@adminjs/nestjs';
import AdminJS, { AdminJSOptions } from 'adminjs';
import * as AdminJSTypeorm from '@adminjs/typeorm';
import * as AdminJSMongoose from '@adminjs/mongoose';
// 
import { CatModel } from '../Mongo/Entity/Cat';
//
import { ActivityPoint } from '../Postgres/entity/ActivityPoint';
import { ActivitySpawn } from '../Postgres/entity/ActivitySpawn';
import { ActivityTeleport } from '../Postgres/entity/ActivityTeleport';
import { Enemy } from '../Postgres/entity/Enemy';
import { EnemySkill } from '../Postgres/entity/EnemySkill';
import { Game } from '../Postgres/entity/Game';
import { GamePlayer } from '../Postgres/entity/GamePlayer';
import { Inventory } from '../Postgres/entity/Inventory';
import { InventoryProduct } from '../Postgres/entity/InventoryProduct';
import { LevelEffect } from '../Postgres/entity/LevelEffect';
import { LevelTemplate } from '../Postgres/entity/LevelTemplate';
import { LevelTemplateSkill } from '../Postgres/entity/LevelTemplateSkill';
import { Map } from '../Postgres/entity/Map';
import { MapPoint } from '../Postgres/entity/MapPoint';
import { Player } from '../Postgres/entity/Player';
import { PlayerProperty } from '../Postgres/entity/PlayerProperty';
import { PlayerSkill } from '../Postgres/entity/PlayerSkill';
import { Product } from '../Postgres/entity/Product';
import { ProductCloth } from '../Postgres/entity/ProductCloth';
import { ProductShell } from '../Postgres/entity/ProductShell';
import { ProductSkill } from '../Postgres/entity/ProductSkill';
import { ProductWeapon } from '../Postgres/entity/ProductWeapon';
import { Requirement } from '../Postgres/entity/Requirement';
import { Skill } from '../Postgres/entity/Skill';
import { SpawnScript } from '../Postgres/entity/SpawnScript';
import { SpawnScriptEnemy } from '../Postgres/entity/SpawnScriptEnemy';
import { WeaponShell } from '../Postgres/entity/WeaponShell';

//
export interface AdminOptions { }

//
@Module({})
export class AdminJSModule {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.debug('--- AdminJSModule: LOADED');
    }

    //
    static async forRootAsync(options: AdminOptions): Promise<DynamicModule> {
        AdminJS.registerAdapter({
            Resource: AdminJSTypeorm.Resource,
            Database: AdminJSTypeorm.Database,
        });

        AdminJS.registerAdapter({
            Resource: AdminJSMongoose.Resource,
            Database: AdminJSMongoose.Database,
        });

        //
        const adminJsOptions = {
            rootPath: '/admin',
            resources: [
                ActivityPoint, ActivitySpawn, ActivityTeleport, Enemy, EnemySkill,
                Game, GamePlayer, Inventory, InventoryProduct, LevelEffect,
                LevelTemplate, LevelTemplateSkill, Map, MapPoint, Player,
                PlayerProperty, PlayerSkill, Product, ProductCloth, ProductShell,
                ProductSkill, ProductWeapon, Requirement, Skill, SpawnScript,
                SpawnScriptEnemy, WeaponShell,
                {
                    resource: CatModel,
                    options: {
                        navigation: { name: 'Mongo - Cat' },
                        list: {
                            before: async (req, res, cxt) => {
                                console.log('--- adminjs = ', req);
                            },
                            handler: async (req, res, cxt) => {
                                console.log('--- adminjs = ', req);
                                return { records: [] };
                            },
                        },
                    },
                },
            ],
        };

        //
        const getAuth = (configService: ConfigService) => ({
            authenticate: async (email: string, password: string) => {
                const aEmail = configService.get('AJS_EMAIL');
                const aPassword = configService.get('AJS_PASSWORD');
                if (email === aEmail && password === aPassword) {
                    return Promise.resolve({
                        email: aEmail,
                        password: aPassword,
                        title: 'ADMIN',
                    });
                }
                return null;
            },
            cookieName: 'adminjs', // process.env.AJS_COOKIE_NAME
            cookiePassword: 'secret', // process.env.AJS_COOKIE_PASSWORD
        });

        //
        const adminModule = AdminModule.createAdminAsync({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: 'configs/.env',
                    isGlobal: true,
                }),
            ],
            useFactory: (configService: ConfigService): AdminModuleOptions => ({
                adminJsOptions: adminJsOptions,
                auth: getAuth(configService),
                // sessionOptions: {
                //     resave: true,
                //     saveUninitialized: true,
                //     secret: 'secret'
                // },
            }),
            inject: [ConfigService],
        });
        return adminModule;
    }
}
