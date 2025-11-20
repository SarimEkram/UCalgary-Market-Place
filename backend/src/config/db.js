import mysql from "mysql";

// Create a pool compatible with callback usage: db.query(sql, params, cb)
// Controllers in this project call `db.query(...)`, so we export the pool as the default export.
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export default db;
