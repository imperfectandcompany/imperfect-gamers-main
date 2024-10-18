// src/app/api/user/[uid]/route.ts

import { NextResponse } from 'next/server';
import poolServer1 from '../../../lib/dbServer1';
import poolServer2 from '../../../lib/dbServer2';
import { Server1User, Profile } from '../../../interfaces/server1';
import { PlayerStats, PlayerRecord, PlayerStageTime } from '../../../interfaces/server2';
import { RowDataPacket } from 'node_modules/mysql2/typings/mysql/lib/protocol/packets/RowDataPacket';

interface UserData {
  server1: Server1User;
  profile: Profile;
  playerStats?: PlayerStats;
  playerRecords?: PlayerRecord[];
  playerStageTimes?: PlayerStageTime[];
}

export async function GET(request: Request, { params }: { params: { uid: string } }) {
  const { uid } = params;

  if (!uid) {
    return NextResponse.json({ error: 'UID is required' }, { status: 400 });
  }

  try {
    // Fetch Server1 Data
    const [userRows] = await poolServer1.execute<RowDataPacket[]>(
      'SELECT id, email, status, admin, verified, createdAt, updatedAt FROM users WHERE id = ?',
      [uid]
    ) as unknown as [Server1User[]];

    if (!userRows.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const server1User = userRows[0];
    const [profileRows] = await poolServer1.execute<RowDataPacket[]>(
      'SELECT username, bio_short, avatar, steam_id, steam_id_64 FROM profiles WHERE user_id = ?',
      [uid]
    ) as unknown as [Profile[]];

    if (!profileRows.length) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profile = profileRows[0];

    // Fetch PlayerStats from Server2
    const steamId64 = profile.steam_id_64;
    let playerStats: PlayerStats | undefined;
    let playerRecords: PlayerRecord[] = [];
    let playerStageTimes: PlayerStageTime[] = [];

    if (steamId64) {
      const [statsRows] = await poolServer2.execute<RowDataPacket[]>(
        'SELECT * FROM activity_tracking.PlayerRecords WHERE SteamID = ?',
        [steamId64]
      ) as unknown as [PlayerStats[]];
      playerStats = statsRows[0];

      const [recordsRows] = await poolServer2.execute<RowDataPacket[]>(
        'SELECT * FROM sharptimer.PlayerRecords WHERE SteamID = ?',
        [steamId64]
      ) as unknown as [PlayerRecord[]];
      playerRecords = recordsRows as PlayerRecord[];

      const [stageTimeRows] = await poolServer2.execute<RowDataPacket[]>(
        'SELECT * FROM sharptimer.PlayerStageTimes WHERE SteamID = ?',
        [steamId64]
      ) as unknown as [PlayerStageTime[]];
      playerStageTimes = stageTimeRows;
    }

    const aggregatedData: UserData = {
      server1: server1User,
      profile: profile,
      playerStats,
      playerRecords,
      playerStageTimes,
    };

    return NextResponse.json(aggregatedData, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
