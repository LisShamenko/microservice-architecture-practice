import { DBTestNative } from './DBTestNative';

// 
export default async () => {
    console.log('');
    console.log('--- setup: start');
    globalThis.databaseConfig = new DBTestNative();
    await globalThis.databaseConfig.createDatabase();
    await globalThis.databaseConfig.fillDatabase();
    console.log('--- setup: end');
}
