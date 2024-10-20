// lib/dbServer2.ts

import mysql from 'mysql2/promise';

// Create a connection pool for Server2
const poolServer2 = mysql.createPool({
  host: process.env.SERVER2_DB_HOST,
  port: Number(process.env.SERVER2_DB_PORT) || 3306,
  user: process.env.SERVER2_DB_USER,
  password: process.env.SERVER2_DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000, // 20 seconds
});

// Function to switch databases within the same server
const useDatabase = async (databaseName: string) => {
  const connection = await poolServer2.getConnection();
  try {
    await connection.query(`USE ${databaseName}`);
  } catch (error) {
    console.error(`Error switching to database ${databaseName}:`, error);
    throw error;
  } finally {
    connection.release();
  }
};

export { poolServer2, useDatabase };
