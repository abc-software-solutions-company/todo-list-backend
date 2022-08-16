export default {
  port: parseInt(process.env.PORT) || 3096,
  nodeEnv: process.env.NODE_ENV || 'production',
  saltRounds: parseInt(process.env.SALT_ROUNDS) || 10
};
