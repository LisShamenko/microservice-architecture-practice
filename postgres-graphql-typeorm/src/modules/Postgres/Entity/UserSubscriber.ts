import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
//
import { User } from './User';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    constructor(
        @InjectDataSource('postgres_db') private dataSource: DataSource,
    ) {
        this.dataSource.subscribers.push(this);
    }

    listenTo() {
        return User;
    }

    beforeInsert(event: InsertEvent<User>) {
        console.log(`--- before insert user --- evnt = `, event.entity);
    }
}
