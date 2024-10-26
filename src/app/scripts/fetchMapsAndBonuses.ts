// src/app/scripts/fetchMapsAndBonuses.ts

import { RowDataPacket } from "mysql2/promise";
import { poolServer2 } from "@lib/dbServer2";

export interface MapRecord {
    MapName: string;
  }
  
  export interface BonusRecord {
    MapName: string;
  }
  
  export interface MapsAndBonuses {
    maps: string[];
    bonuses: string[];
  }

// Function to fetch all maps
const fetchAllMaps = async (): Promise<string[]> => {
  const query = `
    SELECT DISTINCT MapName 
    FROM sharptimer.PlayerRecords 
    WHERE MapName LIKE 'surf\\_%' ESCAPE '\\' 
      AND MapName NOT LIKE '%\\_bonus%' ESCAPE '\\' 
    ORDER BY MapName ASC
  `;

  try {
    const [rows] = await poolServer2.execute<RowDataPacket[]>(query);
    const maps: string[] = rows.map((row: RowDataPacket) => (row as MapRecord).MapName);
    return maps;
  } catch (error) {
    console.error("Error fetching maps:", error);
    return [];
  }
  }

// Function to fetch all bonuses
const fetchAllBonuses = async (): Promise<string[]> => {
  const query = `
    SELECT DISTINCT MapName 
    FROM sharptimer.PlayerRecords 
    WHERE MapName LIKE '%\\_bonus%' ESCAPE '\\' 
    ORDER BY MapName ASC
  `;

  try {
    const [rows] = await poolServer2.execute<RowDataPacket[]>(query);
    const bonuses: string[] = rows.map((row: RowDataPacket) => (row as BonusRecord).MapName);
    return bonuses;
  } catch (error) {
    console.error("Error fetching bonuses:", error);
    return [];
  }
  }

// Main function to execute both queries and log the results
const fetchMapsAndBonuses = async () => {
  try {
    // Execute both queries concurrently
    const [maps, bonuses] = await Promise.all([fetchAllMaps(), fetchAllBonuses()]);

    // Structure the data
    const data: MapsAndBonuses = {
      maps,
      bonuses,
    };

    // Log the JSON data
    console.log(JSON.stringify(data, null, 2));

    // Optional: Write the data to a JSON file
    /*
    const fs = require('fs');
    fs.writeFileSync('mapsAndBonuses.json', JSON.stringify(data, null, 2));
    console.log('Data written to mapsAndBonuses.json');
    */
  } catch (error) {
    console.error("Error fetching maps and bonuses:", error);
  } finally {
    // Close the database connection pool
    await poolServer2.end();
  }
};

// Execute the main function
fetchMapsAndBonuses();
