import mysql from "mysql2";

// TLS config for hosted MySQL (Aiven, PlanetScale, Railway, etc).
//   DB_SSL=true            -> enable TLS
//   DB_SSL_CA=<pem string> -> verify against this CA (most secure; e.g. Aiven's ca.pem)
// If DB_SSL is true but no CA is supplied, we still use TLS but skip CA verification
// so it works out-of-the-box on hosts that use a private CA.
let ssl;
if (process.env.DB_SSL === "true") {
  ssl = process.env.DB_SSL_CA
    ? { ca: process.env.DB_SSL_CA, rejectUnauthorized: true }
    : { rejectUnauthorized: false };
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  ...(ssl ? { ssl } : {}),
});

export default pool;
export const promisePool = pool.promise();
