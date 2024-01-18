import { MockType } from './MockType';
import { FunctionType } from './FunctionType';
// 
import { ErrorHelper } from '../../src/rest/services/ErrorHelper';
import { LevelEffectsHelper } from '../../src/rest/services/LevelEffectsHelper';
import { ProductHelper } from '../../src/rest/services/ProductHelper';
import { PropertyHelper } from '../../src/rest/services/PropertyHelper';
import { SkillHelper } from '../../src/rest/services/SkillHelper';
import { TemplateHelper } from '../../src/rest/services/TemplateHelper';
import { MapHelper } from '../../src/rest/services/MapHelper';

// 
export type HelperServicesMockProps = {
    addProductSkillsImpl?: FunctionType,
    filterSkillsImpl?: FunctionType,
    refillProductSkillsImpl?: FunctionType,
    getTypeUpdatesImpl?: FunctionType,
    getPalyerTemplateImpl?: FunctionType,
    setPropertiesImpl?: FunctionType,
    refillProductsImpl?: FunctionType,
    refillPlayerSkillsImpl?: FunctionType,
    addEffectsImpl?: FunctionType,
    getRemoveEffectsImpl?: FunctionType,
    getEnemyTemplateImpl?: FunctionType,
    refillEnemySkillsImpl?: FunctionType,
    addProductsToListImpl?: FunctionType,
    addLevelSkillsImpl?: FunctionType,
    refillLevelSkillsImpl?: FunctionType,
    getPointUpdatesImpl?: FunctionType,
}

export type HelperImports = {
    isErrorHelper?: boolean,
    isEffectsHelper?: boolean,
    isProductHelper?: boolean,
    isPropertyHelper?: boolean,
    isSkillHelper?: boolean,
    isTemplateHelper?: boolean,
    isMapHelper?: boolean,
}

export class HelperServicesMock {

    public mockErrorHelper: MockType<ErrorHelper>;
    public mockLevelEffectsHelper: MockType<LevelEffectsHelper>;
    public mockProductHelper: MockType<ProductHelper>;
    public mockPropertyHelper: MockType<PropertyHelper>;
    public mockSkillHelper: MockType<SkillHelper>;
    public mockTemplateHelper: MockType<TemplateHelper>;
    public mockMapHelper: MockType<MapHelper>;

    constructor({
        addProductSkillsImpl, filterSkillsImpl,
        refillProductSkillsImpl, getTypeUpdatesImpl,
        getPalyerTemplateImpl, setPropertiesImpl,
        refillProductsImpl, refillPlayerSkillsImpl,
        addEffectsImpl, getRemoveEffectsImpl,
        getEnemyTemplateImpl, refillEnemySkillsImpl,
        addProductsToListImpl, addLevelSkillsImpl,
        refillLevelSkillsImpl, getPointUpdatesImpl,
    }: HelperServicesMockProps) {

        this.mockErrorHelper = {
            foundError: jest.fn(),
            foundArrayError: jest.fn(),
            transactionError: jest.fn(),
            deleteError: jest.fn(),
            logicalError: jest.fn(),
        } as MockType<ErrorHelper>;

        this.mockLevelEffectsHelper = {
            addEffects: jest.fn().mockImplementation(addEffectsImpl),
            getRemoveEffects: jest.fn().mockImplementation(getRemoveEffectsImpl),
        } as MockType<LevelEffectsHelper>;

        this.mockProductHelper = {
            refillProducts: jest.fn().mockImplementation(refillProductsImpl),
            addProductsToList: jest.fn().mockImplementation(addProductsToListImpl),
            removeProductsFromList: jest.fn(),
            getTypeUpdates: jest.fn().mockImplementation(getTypeUpdatesImpl),
            updateTypes: jest.fn(),
        } as MockType<ProductHelper>;

        this.mockPropertyHelper = {
            setProperties: jest.fn().mockImplementation(setPropertiesImpl),
            setAttributes: jest.fn(),
            setParameters: jest.fn(),
        } as MockType<PropertyHelper>;

        this.mockSkillHelper = {
            refillEnemySkills: jest.fn().mockImplementation(refillEnemySkillsImpl),
            refillPlayerSkills: jest.fn().mockImplementation(refillPlayerSkillsImpl),
            refillLevelSkills: jest.fn().mockImplementation(refillLevelSkillsImpl),
            refillProductSkills: jest.fn().mockImplementation(refillProductSkillsImpl),
            addLevelSkills: jest.fn().mockImplementation(addLevelSkillsImpl),
            addProductSkills: jest.fn().mockImplementation(addProductSkillsImpl),
            addSkills: jest.fn(),
            removeSkills: jest.fn(),
            filterSkills: jest.fn().mockImplementation(filterSkillsImpl),
        } as MockType<SkillHelper>;

        this.mockTemplateHelper = {
            getEnemyTemplate: jest.fn().mockImplementation(getEnemyTemplateImpl),
            getPalyerTemplate: jest.fn().mockImplementation(getPalyerTemplateImpl),
            getTemplate: jest.fn(),
        } as MockType<TemplateHelper>;

        this.mockMapHelper = {
            getPointUpdates: jest.fn().mockImplementation(getPointUpdatesImpl),
        } as MockType<MapHelper>;
    }

    getImports({
        isErrorHelper, isEffectsHelper, isProductHelper,
        isPropertyHelper, isSkillHelper, isTemplateHelper,
        isMapHelper,
    }: HelperImports) {
        const imports: any[] = [];
        this.addImport(imports, isErrorHelper, ErrorHelper, this.mockErrorHelper);
        this.addImport(imports, isEffectsHelper, LevelEffectsHelper, this.mockLevelEffectsHelper);
        this.addImport(imports, isProductHelper, ProductHelper, this.mockProductHelper);
        this.addImport(imports, isPropertyHelper, PropertyHelper, this.mockPropertyHelper);
        this.addImport(imports, isSkillHelper, SkillHelper, this.mockSkillHelper);
        this.addImport(imports, isTemplateHelper, TemplateHelper, this.mockTemplateHelper);
        this.addImport(imports, isMapHelper, MapHelper, this.mockMapHelper);
        return imports;
    }

    private addImport(imports: any[], flag: boolean = false, provide: any, value: any) {
        if (flag) {
            imports.push({ provide: provide, useValue: value });
        }
    }
}
