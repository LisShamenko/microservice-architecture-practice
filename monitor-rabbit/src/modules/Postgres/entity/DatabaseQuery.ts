import { BaseEntity, Column, CreateDateColumn, Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
//
import { DatabaseQueryType } from '../enums/DatabaseQueryType';



//
export interface IMongoData {
    url: string,
    body: any,
    method: string,
}

export interface ISequelizeData {
    query: string,
}

export interface ITypeormData {
    url: string,
    body: any,
    method: string,
}

export type DBQueryType = IMongoData | ISequelizeData | ITypeormData;



// 
@Entity('db_queries')
export class DatabaseQuery extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({
        name: 'query_type',
        type: 'enum',
        enum: DatabaseQueryType,
        default: DatabaseQueryType.none,
    })
    queryType: DatabaseQueryType;

    @Column({ type: 'jsonb', default: {} })
    data: DBQueryType;

    @CreateDateColumn({ name: 'create_at' })
    createdDate: Date;
}
