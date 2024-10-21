// src/app/interfaces/server2.ts

/**
 * Represents game-related statistics for a user.
 */
export interface GameStats extends SharpTimerPlayerStat { // Extend GameStats from SharpTimerPlayerStat
    mapsCompleted: number;
    totalMaps: number;
    completionRate: string; // e.g., "75.00%"
    userRecords: UserRecord[];
    playerModelChanger?: PlayerModelChanger;
}

/**
 * Represents a user's record in a specific map.
 */
export interface UserRecord {
    mapName: string;
    steamId: string;
    playerName: string;
    timerTicks: number;
    formattedTime: string;
    unixStamp: number;   // Unix timestamp
    timesFinished: number;
    lastFinished: number;  // Unix timestamp
    style: number;
    stageTimes?: PlayerStageTime[]; // Array of PlayerStageTime associated with this record
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
    // Add other relevant properties as needed
}

/**
 * Aggregates server-related data for a user.
 */
export interface ServersData {
    connectedServers: ServerInfo[];
}
