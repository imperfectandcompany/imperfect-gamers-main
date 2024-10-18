// lib/dbServer2.ts

import mysql from 'mysql2/promise';

// Create a connection pool for Server2
const poolServer2 = mysql.createPool({
  host: process.env.SERVER2_DB_HOST,
  port: Number(process.env.SERVER2_DB_PORT) || 3306,
  user: process.env.SERVER2_DB_USER,
  password: process.env.SERVER2_DB_PASSWORD,
  database: process.env.SERVER2_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0,
});

export default poolServer2;
