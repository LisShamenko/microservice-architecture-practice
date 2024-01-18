import { DataSource, EntityManager, ObjectLiteral, QueryRunner, Repository } from 'typeorm';
// 
import { MockType } from './MockType';
import { FunctionType } from './FunctionType';

// 
export type DataSourceMockProps = {
    // Repository
    findOneImpl?: FunctionType,
    deleteImpl?: FunctionType,
    findImpl?: FunctionType,
    insertImpl?: FunctionType,
    // EntityManager
    saveImpl?: FunctionType,
    removeImpl?: FunctionType,
}

export class DataSourceMockFactory<T extends ObjectLiteral> {
    public entityManagerMock: MockType<EntityManager>;
    public queryRunnerMock: MockType<QueryRunner>;
    public repositoryMock: MockType<Repository<T>>;
    public dataSourceMock: MockType<DataSource>;
    public mockFactory: () => MockType<DataSource>;

    constructor({
        findOneImpl, deleteImpl, findImpl, insertImpl, 
        saveImpl, removeImpl,
    }: DataSourceMockProps) {

        this.entityManagerMock = {
            save: jest.fn().mockImplementation(saveImpl),
            remove: jest.fn().mockImplementation(removeImpl),
        } as MockType<EntityManager>;

        this.queryRunnerMock = {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            manager: this.entityManagerMock,
        } as unknown as MockType<QueryRunner>;

        this.repositoryMock = {
            findOne: jest.fn().mockImplementation(findOneImpl),
            delete: jest.fn().mockImplementation(deleteImpl),
            find: jest.fn().mockImplementation(findImpl),
            insert: jest.fn().mockImplementation(insertImpl),
        } as MockType<Repository<T>>;

        this.dataSourceMock = {
            createQueryRunner: jest.fn().mockImplementation(() => this.queryRunnerMock),
            getRepository: jest.fn().mockImplementation(() => this.repositoryMock),
        } as MockType<DataSource>;

        this.mockFactory = jest.fn(() => this.dataSourceMock);
    }
}
