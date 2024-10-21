// src/app/interfaces/server2.ts

/**
 * Represents game-related statistics for a user.
 */
export interface GameStats extends SharpTimerPlayerStat {
  // Extend GameStats from SharpTimerPlayerStat
  mapsCompleted: number;
  totalMaps: number;
  completionRate: string; // e.g., "75.00%"
  mapRecords: { [mapName: string]: { [style: string]: UserRecord[] } }; // Categorized by map and style (using style name)
  playerModelChanger?: PlayerModelChanger;
}

/**
 * Represents statistics for a player in SharpTimer.
 */
export interface SharpTimerPlayerStat {
  steamId: string;
  playerName: string;
  timesConnected: number;
  lastConnected: number; // Unix timestamp
  globalPoints: number;
  hideTimerHud: boolean;
  hideKeys: boolean;
  soundsEnabled: boolean;
  isVip: boolean;
  bigGifId: string;
  hideJs: boolean;
  playerFov: number;
}

// Style mapping
export const styleMapping: { [key: number]: string } = {
  0: "Normal",
  1: "Low Gravity",
  2: "Fast Forward",
  3: "Sideways",
  4: "Half Sideways",
};

/**
 * Represents a user's record in a specific map or bonus, categorized by style.
 */
export interface UserRecord {
  mapName: string; // Name of the map (could be a base map or bonus map)
  parentMapName?: string; // Name of the parent map, if this is a bonus map
  isBonus: boolean; // Flag to indicate if this record belongs to a bonus map
  steamId: string;
  playerName: string;
  timerTicks: number;
  formattedTime: string;
  unixStamp: number; // Unix timestamp of when the record was set
  timesFinished: number;
  lastFinished: number; // Unix timestamp of the last time the player finished the map
  style: number; // Game style used for this record (e.g., Normal, Low Gravity)
  stageTimes?: PlayerStageTime[]; // Array of PlayerStageTime associated with this record
}

/**
 * Represents the time a player spent on a particular stage.
 */
export interface PlayerStageTime {
  mapName: string;
  steamId: string;
  playerName: string;
  stage: number; // Stage number within the map
  timerTicks: number; // Time spent on this stage
  formattedTime: string;
  velocity: string; // Player's velocity during this stage
}

/**
 * Represents changes to a player's model in the game.
 */
export interface PlayerModelChanger {
  steamId: string;
  tModel: string;
  ctModel: string;
  tPermissionBypass: boolean;
  ctPermissionBypass: boolean;
}

/**
 * Represents information about an admin.
 */
export interface AdminInfo {
  id: number;
  player_steamid: string;
  player_name: string;
  flags: string[];
  // Add other relevant properties as needed
}

/**
 * Represents a server managed by an admin.
 */
export interface AdminServer {
  id: number;
  server_id: number;
  server_name: string;
  // Add other relevant properties as needed
}

/**
 * Aggregates admin-related data for a user.
 */
export interface AdminData {
  adminInfo: AdminInfo[];
  adminServers: AdminServer[];
  bansIssued: number;
  mutesIssued: number;
}

/**
 * Represents a ban record.
 */
export interface BanRecord {
  id: number;
  player_steamid: string;
  admin_steamid: string;
  player_ip: string | null;
  reason: string;
  issued_at: string; // ISO 8601 format
  expires_at: string | null; // ISO 8601 format or null for permanent bans
  server_id: number | null;
  // Add other relevant properties as needed
}

/**
 * Aggregates all ban-related data for a user.
 */
export interface BansData {
  totalBans: number;
  banRecords: BanRecord[];
  ipBans: BanRecord[];
  banServers: ServerInfo[];
}

/**
 * Represents a mute record.
 */
export interface MuteRecord {
  id: number;
  player_steamid: string;
  admin_steamid: string;
  reason: string;
  issued_at: string; // ISO 8601 format
  expires_at: string | null; // ISO 8601 format or null for permanent mutes
  server_id: number | null;
  // Add other relevant properties as needed
}

/**
 * Aggregates all mute-related data for a user.
 */
export interface MutesData {
  totalMutes: number;
  muteRecords: MuteRecord[];
  muteServers: ServerInfo[];
}

/**
 * Represents a server's information.
 */
export interface ServerInfo {
  id: number;
  name: string;
  status: string;
  ip: string;
}

/**
 * Aggregates server-related data for a user.
 */
export interface ServersData {
  connectedServers: ServerInfo[];
}
