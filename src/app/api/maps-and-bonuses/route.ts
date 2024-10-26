import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";
import { poolServer2 } from "@/app/lib/dbServer2";

export interface MapRecord {
  MapName: string;
}

export interface BonusRecord {
  MapName: string;
}

export interface MapsAndBonuses {
  totalMaps: number;
  totalLinearMaps: number;
  totalStagedMaps: number;
  totalBonuses: number;
  maps: {
    name: string;
    isStaged: boolean;
    bonuses: string[];
    bonusCount: number;
  }[];
}

// Helper function to determine if a map is staged based on its name
const isStagedMap = (mapName: string) => mapName.includes("_stage") || mapName.includes("_s");

// Function to fetch all maps
const fetchAllMaps = async (): Promise<string[]> => {
  const query = `
    SELECT DISTINCT MapName 
    FROM sharptimer.PlayerRecords 
    WHERE MapName LIKE 'surf\\_%' 
      AND MapName NOT LIKE '%\\_bonus%' 
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
    WHERE MapName LIKE '%\\_bonus%' 
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

// Organize maps and bonuses into a structured response
const organizeMapsAndBonuses = (maps: string[], bonuses: string[]) => {
  const mapData: {
    name: string;
    isStaged: boolean;
    bonuses: string[];
    bonusCount: number;
  }[] = [];

  // Map to store bonuses by their parent map
  const mapBonuses: { [parentMap: string]: string[] } = {};

  // Organize bonuses under their respective parent maps
  bonuses.forEach(bonus => {
    const parentMap = bonus.split("_bonus")[0];
    if (!mapBonuses[parentMap]) {
      mapBonuses[parentMap] = [];
    }
    mapBonuses[parentMap].push(bonus);
  });

  let totalStagedMaps = 0;
  let totalLinearMaps = 0;

  maps.forEach(map => {
    const bonusesForMap = mapBonuses[map] || [];
    const isStaged = isStagedMap(map);

    mapData.push({
      name: map,
      isStaged,
      bonuses: bonusesForMap,
      bonusCount: bonusesForMap.length,
    });

    if (isStaged) {
      totalStagedMaps++;
    } else {
      totalLinearMaps++;
    }
  });

  const totalMaps = maps.length;
  const totalBonuses = bonuses.length;

  return {
    totalMaps,
    totalLinearMaps,
    totalStagedMaps,
    totalBonuses,
    maps: mapData,
  };
};

// GET handler
export async function GET(request: Request) {
  try {
    // Execute both queries concurrently
    const [maps, bonuses] = await Promise.all([fetchAllMaps(), fetchAllBonuses()]);

    // Organize the data into the required format
    const data: MapsAndBonuses = organizeMapsAndBonuses(maps, bonuses);

    // Return the data as JSON
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching maps and bonuses:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
