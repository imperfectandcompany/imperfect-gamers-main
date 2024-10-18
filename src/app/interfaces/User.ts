// interfaces/User.ts

import { Server1User as Server1User, Profile, Device, LoginToken, Payment } from './server1';
import { PlayerStats, PlayerRecord, PlayerStageTime } from './server2';

export interface UserTest {
  // Server 1 Data
  server1: Server1User;

  // Server 2 Data
  playerStats?: PlayerStats;
  playerRecords?: PlayerRecord[];
  playerStageTimes?: PlayerStageTime[];

  // Derived or Computed Fields (optional)
  hasServerData: boolean;
  // Add other derived fields as necessary
}
