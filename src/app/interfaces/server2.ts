// interfaces/server2.ts

// interface PlayerReplay extends RowDataPacket {
//     MapName: string;
//     SteamID: string;
//     Style: number;
//     Replay?: string;
//   }
export interface GameStats {
  globalPoints?: number;
  rank?: number;
  totalPlayers?: number;
  timesConnected?: number;
  averageTimesConnected?: number;
  mapsCompleted?: number;
  totalMaps?: number;
  completionRate?: string;
  mapsNotCompleted?: string[];
  userRecords?: UserRecord[];
}

export interface UserRecord {
  mapName: string;
  style: number;
  timerTicks: number;
}

export interface AdminData {
  adminInfo: any[];
  adminServers: any[];
  bansIssued: number;
  mutesIssued: number;
}

export interface BansData {
  totalBans: number;
  banRecords: any[];
  ipBans: any[];
  banServers: any[];
}

export interface MutesData {
  totalMutes: number;
  muteRecords: any[];
  muteServers: any[];
}

export interface ServersData {
  connectedServers: any[];
}
