module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL
    || 'postgresql://d_m:me@localhost/spaced-repetition',
  JWT_SECRET: process.env.JWT_SECRET || 'a4de6d55-1451-4f28-995d-d2c7872aefc9',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}
