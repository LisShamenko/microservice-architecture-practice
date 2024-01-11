
export default async () => {
    console.log(`--- teardown: start`);
    await globalThis.databaseConfig.dropDatabase(true);
    console.log(`--- teardown: end`);
};
