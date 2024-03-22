import * as dotenv from 'dotenv';

// 
const processEnv: any = {};

dotenv.config({
    path: 'configs/.env.test',
    processEnv: processEnv,
})

export default () => ({
    dbOptions: {
        type: 'postgres',
        host: processEnv.PG_HOST,
        port: processEnv.PG_PORT,
        username: processEnv.PG_USERNAME,
        password: processEnv.PG_PASSWORD,
        database: processEnv.PG_TESTS_DATABASE,
    },
    dbEnvs: {
        PG_HOST: processEnv.PG_HOST,
        PG_PORT: processEnv.PG_PORT,
        PG_USERNAME: processEnv.PG_USERNAME,
        PG_PASSWORD: processEnv.PG_PASSWORD,
        PG_DATABASE: processEnv.PG_TESTS_DATABASE,
    },
    initialDatabase: processEnv.PG_INITIAL_DATABASE,
});
