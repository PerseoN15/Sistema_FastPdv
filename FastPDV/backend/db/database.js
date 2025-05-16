// backend/db/database.js
const mysql = require('mysql2/promise');
const config = require('../config');

const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  waitForConnections: true,
  connectionLimit: config.database.connectionLimit || 20,
  connectTimeout: config.database.connectTimeout || 10000,
  queueLimit: 0,
  multipleStatements: false,
});

module.exports = pool;

// Funciones para hacer consultas y ejecuciones
module.exports = {
  query: async (sql, params) => {
    try {
      const [results] = await pool.query(sql, params);
      return results;
    } catch (error) {
      console.error('❌ Error en la consulta SQL:', error);
      throw error;
    }
  },
  execute: async (sql, params) => {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('❌ Error en la ejecución SQL:', error);
      throw error;
    }
  },
  getConnection: async () => {
    try {
      return await pool.getConnection();
    } catch (error) {
      console.error('❌ Error al obtener conexión del pool:', error);
      throw error;
    }
  }
};
