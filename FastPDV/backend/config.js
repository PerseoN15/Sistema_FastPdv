// backend/config.js
require('dotenv').config();

module.exports = {
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 20,
    connectTimeout: process.env.DB_CONNECT_TIMEOUT || 10000,
  },
  server: {
    port: process.env.PORT || 5001,
  }
};
