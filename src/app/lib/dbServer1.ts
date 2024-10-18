// lib/dbServer1.ts

import mysql from 'mysql2/promise';

// Create a connection pool for Server1
const poolServer1 = mysql.createPool({
  host: process.env.SERVER1_DB_HOST,
  port: Number(process.env.SERVER1_DB_PORT) || 3306,
  user: process.env.SERVER1_DB_USER,
  password: process.env.SERVER1_DB_PASSWORD,
  database: process.env.SERVER1_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your server capacity
  queueLimit: 0,
});

export default poolServer1;
