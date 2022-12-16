import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  let cors: any = process.env.CORS;
  if (process.env.NODE_ENV !== 'product') cors = '*';
  return {
    port: parseInt(process.env.APP_PORT, 10) || 3333,
    cors,
  };
});
