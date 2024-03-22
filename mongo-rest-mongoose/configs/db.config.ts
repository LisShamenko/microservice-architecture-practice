import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    PORT: process.env.PORT || 6002,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/test',
}));
