import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
// 
import { AppModule } from '../../src/modules/App/app.module';
import { PostgresModule } from '../../src/modules/Postgres/postgres.module';
import { RestModule } from '../../src/rest/rest.module';
import { DBTestNative } from '../db/DBTestNative';
import '../extends/ExtendedExpects';
import { dbEntities } from '../../src/modules/Postgres/entity/entities';
import { InventoryProduct } from '../../src/modules/Postgres/entity/InventoryProduct';
import { LevelEffect } from '../../src/modules/Postgres/entity/LevelEffect';
import { PlayerProperty } from '../../src/modules/Postgres/entity/PlayerProperty';
import { Requirement } from '../../src/modules/Postgres/entity/Requirement';
import { SpawnScriptEnemy } from '../../src/modules/Postgres/entity/SpawnScriptEnemy';

// 
export class TestsPipeline {
    app: INestApplication;
    httpServer: any;
    dbTest: DBTestNative;
    dataSource: DataSource;

    async beforeAll() {
        this.dbTest = new DBTestNative();
        this.dataSource = await this.dbTest.createDataSource({
            entities: dbEntities,
        });

        const importPostgresModule = await PostgresModule.forRootAsync({
            entities: dbEntities,
        });
        const importRestModule = await RestModule.forRootAsync();

        const appModule = await AppModule.forRootAsync({
            imports: [
                importPostgresModule,
                importRestModule,
                WinstonModule.forRoot({
                    transports: [new winston.transports.Console({})],
                }),
            ]
        });

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [appModule],
        })
            .overrideProvider(ConfigService)
            .useValue({
                get: (key: string, def: any) => {
                    const envs = this.dbTest.getEnvironment();
                    return envs[key];
                },
            })
            .compile();

        this.app = moduleFixture.createNestApplication();
        await this.app.init();
        this.httpServer = this.app.getHttpServer();
    }

    async afterAll() {
        await this.dataSource.destroy();
    };

    testProduct(item: InventoryProduct | undefined,
        count_in_all_slots: number, title: string, price: number,
        max_in_slot: number, requirement_id: number,
    ) {
        expect(item?.count_in_all_slots).toBe(count_in_all_slots);
        expect(item?.product.title).toBe(title);
        expect(item?.product.price).toBe(price);
        expect(item?.product.max_in_slot).toBe(max_in_slot);
        expect(item?.product.requirement_id).toBe(requirement_id);
    }

    testEffect(item: LevelEffect | undefined, id: number,
        count_matches: number, is_equipment: boolean,
        property_column: string, delta_value: number
    ) {
        expect(item?.id).toBe(id);
        expect(item?.count_matches).toBe(count_matches);
        expect(item?.is_equipment).toBe(is_equipment);
        expect(item?.property_column).toBe(property_column);
        expect(item?.delta_value).toBe(delta_value);
    }

    testProperties(playerProperty: PlayerProperty | Requirement | undefined,
        strength: number, endurance: number, intelligence: number, agility: number,
        fire_weapons: number, melee_weapons: number, throwing: number, doctor: number,
        sneak: number, steal: number, traps: number, science: number, repair: number,
        barter: number,
    ) {
        expect(playerProperty).toMatchObject({
            "strength": strength,
            "endurance": endurance,
            "intelligence": intelligence,
            "agility": agility,
            "fire_weapons": fire_weapons,
            "melee_weapons": melee_weapons,
            "throwing": throwing,
            "doctor": doctor,
            "sneak": sneak,
            "steal": steal,
            "traps": traps,
            "science": science,
            "repair": repair,
            "barter": barter,
        });
    }

    testSpawn(item: SpawnScriptEnemy | undefined, id: number,
        count: number, spawn_moment: number, enemy_id: number,
    ) {
        expect(item?.id).toBe(id);
        expect(item?.count).toBe(count);
        expect(item?.spawn_moment).toBe(spawn_moment);
        expect(item?.enemy_id).toBe(enemy_id);
    }

    // 
    async nextRequirementId() {
        const result = await this.dataSource.getRepository(Requirement).query(
            `SELECT nextval(pg_get_serial_sequence('requirements', 'id')) AS new_id`);
        return Number.parseInt(result[0].new_id);
    }
}
