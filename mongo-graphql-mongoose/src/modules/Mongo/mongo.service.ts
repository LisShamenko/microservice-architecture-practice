import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Collection, Connection, Model } from 'mongoose';
//
import { CreateCatDto } from './Dto/CreateCatDto';
import { Cat, CatDocument } from './Entity/Cat';

@Injectable()
export class MongoService {
    constructor(
        @InjectConnection('catsDb') private connection: Connection,
        @InjectModel(Cat.name, 'catsDb') private catModel: Model<CatDocument>,
    ) {
        this.catModel
            .find()
            .exec()
            .then((cats) => console.log('CATS = ', cats));
    }

    async create(createCatDto: CreateCatDto): Promise<Cat> {
        const createdCat = new this.catModel(createCatDto);
        return createdCat.save();
    }

    async findAll(): Promise<Cat[]> {
        return this.catModel.find().exec();
    }

    async getTest() {
        console.log('***************************** I');
        const createCatDto: CreateCatDto = new CreateCatDto('jlby', 12);
        const createdCat = new this.catModel(createCatDto);
        await createdCat.save();

        console.log('***************************** II');
        const result = await this.catModel.find().exec();
        console.log('***************************** III result = ', result);

        const res: Collection = this.connection.collections['cats'];
        const cursor = res.find();
        cursor.toArray().then((res) => console.log('===================', res));

        return 'OK';
    }
}
