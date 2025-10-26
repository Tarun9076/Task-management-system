const { Sequelize } = require('sequelize');
const path = require('path');

const databaseUrl = process.env.DATABASE_URL;
const ssl = process.env.DB_SSL === 'true';

let sequelize;

try {
  if (databaseUrl) {
    sequelize = new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: ssl ? { ssl: { require: true, rejectUnauthorized: false } } : {}
    });
  } else if (process.env.DATABASE_TYPE === 'postgres') {
    sequelize = new Sequelize(
      process.env.DB_NAME || 'tms',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false
      }
    );
  } else {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    });
  }
} catch (err) {
  console.error('Database connection error:', err);
  process.exit(1);
}

module.exports = { sequelize };