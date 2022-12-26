import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const config = {
    type: process.env.DATABASE_TYPE || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    password: process.env.DATABASE_PASSWORD || 'postgres',
    username: process.env.DATABASE_USERNAME || 'postgres',
    name: process.env.DATABASE_NAME || 'postgres',
    schema: process.env.DATABASE_SCHEMA,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    dropSchema: false,
    autoLoadEntities: true,
  };
  if (process.env.NODE_ENV === 'dev') {
    config.port = 5436;
    config.synchronize = true;
  }
  if (process.env.NODE_ENV === 'stage') {
    config.port = 5436;
    config.synchronize = true;
  }
  if (process.env.NODE_ENV === 'test') {
    config.port = 5437;
    config.synchronize = true;
    config.dropSchema = true;
  }
  return config;
});
