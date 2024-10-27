// src/app/interfaces/server2.ts

/**
 * Represents game-related statistics for a user.
 */
export interface GameStats extends SharpTimerPlayerStat {
  mapsCompleted: number;
  totalMaps: number;
  globalPlacement?: any;
  totalGlobalPlayers?: any;
  totalPlayers: number;
  completionRate: string;
  mapRecords: { [mapName: string]: { [style: string]: UserRecord[] } };
  playerModelChanger?: PlayerModelChanger;
}

/**
 * Represents statistics for a player in SharpTimer.
 */
export interface SharpTimerPlayerStat {
  steamId: string;
  playerName: string;
  timesConnected: number;
  lastConnected: number;
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
  mapName: string;
  parentMapName?: string;
  isBonus: boolean;
  isStaged: boolean;
  steamId: string;
  playerName: string;
  timerTicks: number;
  formattedTime: string;
  unixStamp: number;
  timesFinished: number;
  lastFinished: number;
  style: number;
  stageTimes?: PlayerStageTime[];
  mapPlacement?: any;
  totalMapPlayers?: any;
}

/**
 * Represents the time a player spent on a particular stage.
 */
export interface PlayerStageTime {
  mapName: string;
  steamId: string;
  playerName: string;
  stage: number;
  timerTicks: number;
  formattedTime: string;
  velocity: string;
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
}

/**
 * Represents a server managed by an admin.
 */
export interface AdminServer {
  id: number;
  server_id: number;
  server_name: string;
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
  issued_at: string;
  expires_at: string | null;
  server_id: number | null;
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
  issued_at: string;
  expires_at: string | null;
  server_id: number | null;
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