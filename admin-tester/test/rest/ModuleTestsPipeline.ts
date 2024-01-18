import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Provider } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
// 
import { ErrorHelper } from '../../src/rest/services/ErrorHelper';
import { LevelEffectsHelper } from '../../src/rest/services/LevelEffectsHelper';
import { ProductHelper } from '../../src/rest/services/ProductHelper';
import { PropertyHelper } from '../../src/rest/services/PropertyHelper';
import { SkillHelper } from '../../src/rest/services/SkillHelper';
import { TemplateHelper } from '../../src/rest/services/TemplateHelper';
// 
import { DataSourceMockProps, DataSourceMockFactory } from '../mock/DataSourceMockFactory';
import { HelperServicesMockProps, HelperServicesMock, HelperImports } from '../mock/HelperServicesMock';
import { Skill } from '../../src/modules/Postgres/entity/Skill';
import { MockType } from '../mock/MockType';

// 
export class ModulesPipe {
    app: INestApplication;
    dataSource: DataSource;
    dsMockFactory: DataSourceMockFactory<Skill>;
    helpersMock: HelperServicesMock;

    /** DataSource Mock */
    dsmt: MockType<DataSource>;
    get getRepositoryCalls() { return this.dsmt.getRepository.mock.calls; }
    getRepositoryClear = () => this.dsmt.getRepository.mockClear();

    /** Repository< Skill > Mock */
    rmt: MockType<Repository<Skill>>;
    get findCalls() { return this.rmt.find.mock.calls; }
    findClear = () => this.rmt.find.mockClear();
    get findOneCalls() { return this.rmt.findOne.mock.calls; }
    findOneClear = () => this.rmt.findOne.mockClear();
    get deleteCalls() { return this.rmt.delete.mock.calls; }
    deleteClear = () => this.rmt.delete.mockClear();
    get insertCalls() { return this.rmt.insert.mock.calls; }
    insertClear = () => this.rmt.insert.mockClear();

    /** QueryRunner Mock */
    qrmt: MockType<QueryRunner>;

    /** EntityManager Mock */
    emmt: MockType<EntityManager>;
    get saveCalls() { return this.emmt.save.mock.calls; }
    saveClear = () => this.emmt.save.mockClear();
    get removeCalls() { return this.emmt.remove.mock.calls; }
    removeClear = () => this.emmt.remove.mockClear();

    /** ErrorHelper Mock */
    ehmt: MockType<ErrorHelper>;
    get foundArrayErrorCalls() { return this.ehmt.foundArrayError.mock.calls; }
    foundArrayErrorClear = () => this.ehmt.foundArrayError.mockClear();
    get foundErrorCalls() { return this.ehmt.foundError.mock.calls; }
    foundErrorClear = () => this.ehmt.foundError.mockClear();

    /** LevelEffectsHelper Mock */
    lehmt: MockType<LevelEffectsHelper>;
    get addEffectsCalls() { return this.lehmt.addEffects.mock.calls; }
    addEffectsClear = () => this.lehmt.addEffects.mockClear();
    get getRemoveEffectsCalls() { return this.lehmt.getRemoveEffects.mock.calls; }
    getRemoveEffectsClear = () => this.lehmt.getRemoveEffects.mockClear();

    /** ProductHelper Mock */
    pdhmt: MockType<ProductHelper>;
    get getTypeUpdatesCalls() { return this.pdhmt.getTypeUpdates.mock.calls; }
    getTypeUpdatesClear = () => this.pdhmt.getTypeUpdates.mockClear();
    get updateTypesCalls() { return this.pdhmt.updateTypes.mock.calls; }
    updateTypesClear = () => this.pdhmt.updateTypes.mockClear();
    get refillProductsCalls() { return this.pdhmt.refillProducts.mock.calls; }
    refillProductsClear = () => this.pdhmt.refillProducts.mockClear();
    get addProductsToListCalls() { return this.pdhmt.addProductsToList.mock.calls; }
    addProductsToListClear = () => this.pdhmt.addProductsToList.mockClear();

    /** PropertyHelper Mock */
    pphmt: MockType<PropertyHelper>;
    get setPropertiesCalls() { return this.pphmt.setProperties.mock.calls; }
    setPropertiesClear = () => this.pphmt.setProperties.mockClear();

    /** SkillHelper Mock */
    shmt: MockType<SkillHelper>;
    get addProductSkillsCalls() { return this.shmt.addProductSkills.mock.calls; }
    addProductSkillsClear = () => this.shmt.addProductSkills.mockClear();
    get filterSkillsCalls() { return this.shmt.filterSkills.mock.calls; }
    filterSkillsClear = () => this.shmt.filterSkills.mockClear();
    get refillProductSkillsCalls() { return this.shmt.refillProductSkills.mock.calls; }
    refillProductSkillsClear = () => this.shmt.refillProductSkills.mockClear();
    get refillPlayerSkillsCalls() { return this.shmt.refillPlayerSkills.mock.calls; }
    refillPlayerSkillsClear = () => this.shmt.refillPlayerSkills.mockClear();
    get refillEnemySkillsCalls() { return this.shmt.refillEnemySkills.mock.calls; }
    refillEnemySkillsClear = () => this.shmt.refillEnemySkills.mockClear();
    get addLevelSkillsCalls() { return this.shmt.addLevelSkills.mock.calls; }
    addLevelSkillsClear = () => this.shmt.addLevelSkills.mockClear();
    get refillLevelSkillsCalls() { return this.shmt.refillLevelSkills.mock.calls; }
    refillLevelSkillsClear = () => this.shmt.refillLevelSkills.mockClear();

    /** TemplateHelper Mock */
    thmt: MockType<TemplateHelper>;
    get getPalyerTemplateCalls() { return this.thmt.getPalyerTemplate.mock.calls; }
    getPalyerTemplateClear = () => this.thmt.getPalyerTemplate.mockClear();
    get getEnemyTemplateCalls() { return this.thmt.getEnemyTemplate.mock.calls; }
    getEnemyTemplateClear = () => this.thmt.getEnemyTemplate.mockClear();

    // 
    constructor(dsProps: DataSourceMockProps, hsProps: HelperServicesMockProps) {
        this.dsMockFactory = new DataSourceMockFactory(dsProps);
        this.dsmt = this.dsMockFactory.dataSourceMock;
        this.rmt = this.dsMockFactory.repositoryMock;
        this.qrmt = this.dsMockFactory.queryRunnerMock;
        this.emmt = this.dsMockFactory.entityManagerMock;

        this.helpersMock = new HelperServicesMock(hsProps);
        this.ehmt = this.helpersMock.mockErrorHelper;
        this.lehmt = this.helpersMock.mockLevelEffectsHelper;
        this.pdhmt = this.helpersMock.mockProductHelper;
        this.pphmt = this.helpersMock.mockPropertyHelper;
        this.shmt = this.helpersMock.mockSkillHelper;
        this.thmt = this.helpersMock.mockTemplateHelper;
    }

    // 
    async beforeAll(service: Provider, importFlags: HelperImports) {

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                WinstonModule.forRoot({
                    transports: [new winston.transports.Console({})],
                }),
            ],
            providers: [
                service,
                ...this.helpersMock.getImports(importFlags),
                {
                    provide: getDataSourceToken('postgres_db'),
                    useFactory: this.dsMockFactory.mockFactory,
                },
            ],
        }).compile();

        this.app = moduleFixture.createNestApplication();
        await this.app.init();
        this.dataSource = this.app.get(getDataSourceToken('postgres_db'));
    }

    async afterAll() { }

    // 
    getService(T: any) {
        return this.app.get(T);
    }

    testQueryRunnerSuccess() {
        expect(this.dsmt.createQueryRunner.mock.calls).toHaveLength(1);
        expect(this.qrmt.connect.mock.calls).toHaveLength(1);
        expect(this.qrmt.startTransaction.mock.calls).toHaveLength(1);
        expect(this.qrmt.release.mock.calls).toHaveLength(1);
        expect(this.qrmt.commitTransaction.mock.calls).toHaveLength(1);

        this.dsmt.createQueryRunner.mockClear();
        this.qrmt.connect.mockClear();
        this.qrmt.startTransaction.mockClear();
        this.qrmt.release.mockClear();
        this.qrmt.commitTransaction.mockClear();
    }

    testQueryRunnerError() {
        expect(this.dsmt.createQueryRunner.mock.calls).toHaveLength(1);
        expect(this.qrmt.connect.mock.calls).toHaveLength(1);
        expect(this.qrmt.startTransaction.mock.calls).toHaveLength(1);
        expect(this.qrmt.release.mock.calls).toHaveLength(1);
        expect(this.qrmt.rollbackTransaction.mock.calls).toHaveLength(1);
        expect(this.ehmt.transactionError.mock.calls).toHaveLength(1);

        this.dsmt.createQueryRunner.mockClear();
        this.qrmt.connect.mockClear();
        this.qrmt.startTransaction.mockClear();
        this.qrmt.release.mockClear();
        this.qrmt.rollbackTransaction.mockClear();
        this.ehmt.transactionError.mockClear();
    }
}
