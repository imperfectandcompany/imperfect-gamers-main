import { NextResponse } from "next/server";
import poolServer1 from "@/app/lib/dbServer1";
import { poolServer2 } from "@/app/lib/dbServer2";
import { RowDataPacket } from "mysql2";

import {
  User,
  Profile,
  ActivityLog,
  Device,
  DeviceIP,
  LoginLog,
  LoginToken,
  Payment,
  CheckoutDetail,
  DeviceUsed,
} from "@/app/interfaces/server1";
import {
  GameStats,
  UserRecord,
  AdminData,
  BansData,
  MutesData,
  ServersData,
  AdminInfo,
  BanRecord,
  MuteRecord,
  ServerInfo,
  PlayerStageTime,
} from "@/app/interfaces/server2";
import { UserProfile } from "@/app/interfaces/UserDataResponse";

export interface UserDataResponse {
  user: UserProfile;
  activity?: {
    logs?: ActivityLog[];
    devices?: Device[];
    loginLogs?: LoginLog[];
    loginTokens?: LoginToken[];
  };
  payments?: {
    made?: Payment[];
    received?: Payment[];
    checkoutDetails?: CheckoutDetail[];
  };
  adminData?: AdminData;
  bans?: BansData;
  mutes?: MutesData;
  servers?: ServersData;
  potentialAltAccounts?: string[];
  devicesUsed?: DeviceUsed[];
  recentActivity?: ActivityLog[];
}

// Fetch configuration flags
const fetchConfig = {
  fetchProfile: true,
  fetchActivityLog: false,
  fetchDevices: false,
  fetchLoginLogs: false,
  fetchLoginTokens: false,
  fetchPayments: false,
  fetchCheckoutDetails: false,
  fetchGameStats: true,
  fetchAdminData: false,
  fetchBansData: false,
  fetchMutesData: false,
  fetchServersData: false,
  fetchAdditionalData: false,
};

// Dependencies between fetchConfig flags
const dependencies = {
  fetchAdditionalData: ["fetchDevices", "fetchActivityLog"],
  fetchGameStats: ["fetchProfile"],
  fetchAdminData: ["fetchProfile"],
  fetchBansData: ["fetchProfile"],
  fetchMutesData: ["fetchProfile"],
  fetchServersData: ["fetchProfile"],
};

function checkDependencies(
  config: typeof fetchConfig,
  dependencies: Record<string, string[]>
): boolean {
  for (const [key, requiredFlags] of Object.entries(dependencies)) {
    if (config[key as keyof typeof fetchConfig]) {
      for (const flag of requiredFlags) {
        if (!config[flag as keyof typeof fetchConfig]) {
          console.error(
            `Configuration Error: "${key}" requires "${flag}" to be enabled.`
          );
          return false;
        }
      }
    }
  }
  return true;
}

export async function GET(
  request: Request,
  { params }: { params: { uid: string } }
) {
  const { uid } = params;

  if (!uid) {
    return NextResponse.json({ error: "UID is required" }, { status: 400 });
  }

  // Check if dependencies are satisfied
  if (!checkDependencies(fetchConfig, dependencies)) {
    return NextResponse.json(
      {
        error:
          "Configuration Error: Unmet dependencies in fetchConfig. Check server logs for details.",
      },
      { status: 500 }
    );
  }

  try {
    // Fetch user data from Server1
    let user: User;
    try {
      const [userRows] = (await poolServer1.execute<RowDataPacket[]>(
        "SELECT id, email, status, admin, verified, createdAt FROM users WHERE id = ?",
        [uid]
      )) as unknown as [User[]];

      if (userRows.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      user = userRows[0];
    } catch (error) {
      console.error("Error fetching user data from Server1:", {
        query:
          "SELECT id, email, status, admin, verified, createdAt FROM users WHERE id = ?",
        params: [uid],
        error,
      });
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    // Initialize data variables
    let profile: Profile | null = null;
    let activityLogRows: ActivityLog[] = [];
    let devicesWithIPs: Device[] = [];
    let loginLogRows: LoginLog[] = [];
    let loginTokenRows: LoginToken[] = [];
    let paymentRows: Payment[] = [];
    let checkoutRows: CheckoutDetail[] = [];
    let allUserIPs: string[] = [];
    let userIPs: string[] = [];
    let loginIPs: string[] = [];

    // Fetch data based on config flags
    if (fetchConfig.fetchProfile) {
      // Fetch profile data
      try {
        const [profileRows] = (await poolServer1.execute<RowDataPacket[]>(
          "SELECT username, bio_short, avatar, steam_id, steam_id_64, steam_id_3 FROM profiles WHERE user_id = ?",
          [uid]
        )) as unknown as [Profile[]];

        profile = profileRows[0] || null;
      } catch (error) {
        console.error("Error fetching profile data from Server1:", {
          query:
            "SELECT username, bio_short, avatar, steam_id, steam_id_64, steam_id_3 FROM profiles WHERE user_id = ?",
          params: [uid],
          error,
        });
        profile = null;
      }
    }

    if (fetchConfig.fetchActivityLog) {
      // Fetch activity_log
      try {
        const [activityRows] = (await poolServer1.execute<RowDataPacket[]>(
          "SELECT id, user_id, action, activity_data, created_at, location FROM activity_log WHERE user_id = ?",
          [uid]
        )) as unknown as [ActivityLog[]];
        activityLogRows = activityRows;
      } catch (error) {
        console.error("Error fetching activity log from Server1:", {
          query:
            "SELECT id, user_id, action, activity_data, created_at, location FROM activity_log WHERE user_id = ?",
          params: [uid],
          error,
        });
        activityLogRows = [];
      }
    }

    if (fetchConfig.fetchDevices) {
      // Fetch devices and associated IPs
      try {
        const [deviceRows] = (await poolServer1.execute<RowDataPacket[]>(
          "SELECT id, user_id, device_name, first_login, last_login, is_logged_in FROM devices WHERE user_id = ?",
          [uid]
        )) as unknown as [Omit<Device, "ips">[]];

        // For each device, fetch device_ips
        devicesWithIPs = await Promise.all(
          deviceRows.map(async (device) => {
            try {
              const [ipRows] = (await poolServer1.execute<RowDataPacket[]>(
                "SELECT id, device_id, ip_address, created_at FROM device_ips WHERE device_id = ?",
                [device.id]
              )) as unknown as [DeviceIP[]];

              return {
                ...device,
                ips: ipRows,
              } as Device;
            } catch (error) {
              console.error(
                `Error fetching IPs for device ${device.id} from Server1:`,
                {
                  query:
                    "SELECT id, device_id, ip_address, created_at FROM device_ips WHERE device_id = ?",
                  params: [device.id],
                  error,
                }
              );
              return {
                ...device,
                ips: [],
              } as unknown as Device;
            }
          })
        );

        // Collect all known IP addresses from device_ips
        userIPs = devicesWithIPs
          .flatMap((device) => device.ips)
          .map((ip) => ip.ip_address);
      } catch (error) {
        console.error("Error fetching devices from Server1:", {
          query:
            "SELECT id, user_id, device_name, first_login, last_login, is_logged_in FROM devices WHERE user_id = ?",
          params: [uid],
          error,
        });
        devicesWithIPs = [];
        userIPs = [];
      }
    }

    if (fetchConfig.fetchLoginLogs) {
      // Also collect IPs from login_logs
      try {
        const [loginLogs] = (await poolServer1.execute<RowDataPacket[]>(
          "SELECT id, user_id, device_id, ip_address, timestamp, success FROM login_logs WHERE user_id = ?",
          [uid]
        )) as unknown as [LoginLog[]];
        loginLogRows = loginLogs;
        loginIPs = loginLogRows.map((log) => log.ip_address);
      } catch (error) {
        console.error("Error fetching login logs from Server1:", {
          query:
            "SELECT id, user_id, device_id, ip_address, timestamp, success FROM login_logs WHERE user_id = ?",
          params: [uid],
          error,
        });
        loginLogRows = [];
        loginIPs = [];
      }
    }

    // Combine userIPs and loginIPs if both are fetched
    if (fetchConfig.fetchDevices || fetchConfig.fetchLoginLogs) {
      allUserIPs = Array.from(new Set([...userIPs, ...loginIPs]));
    }

    if (fetchConfig.fetchLoginTokens) {
      try {
        // Fetch login_tokens
        const [tokens] = (await poolServer1.execute<RowDataPacket[]>(
          "SELECT id, user_id, token, device_id, expiration_time FROM login_tokens WHERE user_id = ?",
          [uid]
        )) as unknown as [LoginToken[]];
        loginTokenRows = tokens;
      } catch (error) {
        console.error("Error fetching login tokens from Server1:", {
          query:
            "SELECT id, user_id, token, device_id, expiration_time FROM login_tokens WHERE user_id = ?",
          params: [uid],
          error,
        });
        loginTokenRows = [];
      }
    }

    if (fetchConfig.fetchPayments) {
      try {
        // Fetch payments where user is payer or recipient
        const [payments] = (await poolServer1.execute<RowDataPacket[]>(
          "SELECT id, payer_user_id, recipient_user_id, transaction_email, amount, currency, payment_method, status, created_at, updated_at, payment_data FROM payments WHERE payer_user_id = ? OR recipient_user_id = ?",
          [uid, uid]
        )) as unknown as [Payment[]];
        paymentRows = payments;
      } catch (error) {
        console.error("Error fetching payments from Server1:", {
          query:
            "SELECT id, payer_user_id, recipient_user_id, transaction_email, amount, currency, payment_method, status, created_at, updated_at, payment_data FROM payments WHERE payer_user_id = ? OR recipient_user_id = ?",
          params: [uid, uid],
          error,
        });
        paymentRows = [];
      }
    }

    if (fetchConfig.fetchCheckoutDetails) {
      try {
        // Fetch user_checkout_details
        const [checkouts] = (await poolServer1.execute<RowDataPacket[]>(
          "SELECT id, user_id, basket_id, package_id, checkout_url, created_at, updated_at FROM user_checkout_details WHERE user_id = ?",
          [uid]
        )) as unknown as [CheckoutDetail[]];
        checkoutRows = checkouts;
      } catch (error) {
        console.error("Error fetching checkout details from Server1:", {
          query:
            "SELECT id, user_id, basket_id, package_id, checkout_url, created_at, updated_at FROM user_checkout_details WHERE user_id = ?",
          params: [uid],
          error,
        });
        checkoutRows = [];
      }
    }

    // Prepare data from Server2
    let gameStats: GameStats | undefined = undefined;
    let adminData: AdminData | undefined = undefined;
    let bansData: BansData | undefined = undefined;
    let mutesData: MutesData | undefined = undefined;
    let serversData: ServersData | undefined = undefined;

    let potentialAltAccounts: string[] = [];
    let devicesUsed: DeviceUsed[] = [];
    let recentActivity: ActivityLog[] = [];

    // Fetch Steam IDs if required
    let steamIds: string[] = [];
    if (
      profile &&
      (profile.steam_id || profile.steam_id_64 || profile.steam_id_3)
    ) {
      steamIds = [
        profile.steam_id,
        profile.steam_id_64,
        profile.steam_id_3,
      ].filter(Boolean) as string[];
    } else {
      // If profile is not available or steam IDs are not available, and data depends on steam IDs, handle this
      if (
        fetchConfig.fetchGameStats ||
        fetchConfig.fetchAdminData ||
        fetchConfig.fetchBansData ||
        fetchConfig.fetchMutesData ||
        fetchConfig.fetchServersData ||
        fetchConfig.fetchAdditionalData
      ) {
        console.error(
          "Steam IDs are required for the requested data but are not available."
        );
        return NextResponse.json(
          {
            error:
              "Steam IDs are required for the requested data but are not available.",
          },
          { status: 400 }
        );
      }
    }

    if (steamIds.length > 0) {
      // Proceed to fetch data from Server2

      // Fetch game stats
      if (fetchConfig.fetchGameStats) {
        try {
          const placeholdersSteamIds = steamIds.map(() => "?").join(",");

          // Fetch PlayerStats
          const playerStatsQuery = `SELECT SteamID, PlayerName, TimesConnected, LastConnected, GlobalPoints, HideTimerHud, HideKeys, SoundsEnabled, IsVip, BigGifID, HideJS, PlayerFov FROM sharptimer.PlayerStats WHERE SteamID IN (${placeholdersSteamIds})`;
          const [playerStatsRows] = await poolServer2.execute<RowDataPacket[]>(
            playerStatsQuery,
            steamIds
          );

          // Ensure playerStatsRows is not empty
          const playerStats = playerStatsRows[0];
          if (!playerStats) {
            throw new Error("No player stats found");
          }

          // Fetch PlayerRecords
          const playerRecordsQuery = `SELECT MapName, SteamID, PlayerName, TimerTicks, FormattedTime, UnixStamp, TimesFinished, LastFinished, Style FROM sharptimer.PlayerRecords WHERE SteamID IN (${placeholdersSteamIds})`;
          const [playerRecordsRows] = await poolServer2.execute<
            RowDataPacket[]
          >(playerRecordsQuery, steamIds);

          // Fetch PlayerStageTimes
          const playerStageTimesQuery = `SELECT MapName, SteamID, PlayerName, Stage, TimerTicks, FormattedTime, Velocity FROM sharptimer.PlayerStageTimes WHERE SteamID IN (${placeholdersSteamIds})`;
          const [playerStageTimesRows] = await poolServer2.execute<
            RowDataPacket[]
          >(playerStageTimesQuery, steamIds);

          // Calculate mapsCompleted and totalMaps
          const mapsCompleted = playerRecordsRows.length;
          const totalMaps = 100; // TODO: Placeholder, replace with actual total maps
          const completionRate =
            ((mapsCompleted / totalMaps) * 100).toFixed(2) + "%";

          // Construct gameStats
          gameStats = {
            steamId: playerStats.SteamID,
            playerName: playerStats.PlayerName,
            timesConnected: playerStats.TimesConnected,
            lastConnected: playerStats.LastConnected,
            globalPoints: playerStats.GlobalPoints,
            hideTimerHud: playerStats.HideTimerHud,
            hideKeys: playerStats.HideKeys,
            soundsEnabled: playerStats.SoundsEnabled,
            isVip: playerStats.IsVip,
            bigGifId: playerStats.BigGifID,
            hideJs: playerStats.HideJS,
            playerFov: playerStats.PlayerFov,
            mapsCompleted: mapsCompleted,
            totalMaps: totalMaps,
            completionRate: completionRate,
            userRecords: playerRecordsRows.map((record) => ({
              mapName: record.MapName,
              steamId: record.SteamID,
              playerName: record.PlayerName,
              timerTicks: record.TimerTicks,
              style: record.Style,
              formattedTime: record.FormattedTime,
              unixStamp: record.UnixStamp,
              timesFinished: record.TimesFinished,
              lastFinished: record.LastFinished,
              // Add stage times for this record
              stageTimes: playerStageTimesRows
                .filter((stageTime) => stageTime.MapName === record.MapName)
                .map((stageTime) => ({
                  mapName: stageTime.MapName,
                  steamId: stageTime.SteamID,
                  playerName: stageTime.PlayerName,
                  stage: stageTime.Stage,
                  timerTicks: stageTime.TimerTicks,
                  formattedTime: stageTime.FormattedTime,
                  velocity: stageTime.Velocity,
                })),
            })),
          };
        } catch (error) {
          console.error("Error fetching game stats from Server2:", error);
          gameStats = undefined; // Ensure this variable is defined in the outer scope
        }
      }

      // Fetch admin data
      if (fetchConfig.fetchAdminData) {
        try {
          const placeholdersSteamIds = steamIds.map(() => "?").join(",");

          // Fetch sa_admins
          const adminQuery = `SELECT * FROM simple_admin.sa_admins WHERE player_steamid IN (${placeholdersSteamIds})`;
          const [adminRows] = await poolServer2.execute<RowDataPacket[]>(
            adminQuery,
            steamIds
          );

          // Fetch bans issued by the admin
          const bansIssuedQuery = `SELECT COUNT(*) as bansIssued FROM simple_admin.sa_bans WHERE admin_steamid IN (${placeholdersSteamIds})`;
          const [bansIssuedRows] = await poolServer2.execute<RowDataPacket[]>(
            bansIssuedQuery,
            steamIds
          );

          // Fetch mutes issued by the admin
          const mutesIssuedQuery = `SELECT COUNT(*) as mutesIssued FROM simple_admin.sa_mutes WHERE admin_steamid IN (${placeholdersSteamIds})`;
          const [mutesIssuedRows] = await poolServer2.execute<RowDataPacket[]>(
            mutesIssuedQuery,
            steamIds
          );

          adminData = {
            adminInfo: adminRows.map((row) => ({
              id: row.id,
              player_steamid: row.player_steamid,
              player_name: row.player_name,
              flags: row.flags,
              // Add other properties from AdminInfo as needed
            })) as AdminInfo[],
            bansIssued: bansIssuedRows[0]?.bansIssued || 0,
            mutesIssued: mutesIssuedRows[0]?.mutesIssued || 0,
            adminServers: [], // Assuming an empty array for 'adminServers' to fix the missing property error
          };
        } catch (error) {
          console.error("Error fetching admin data from Server2:", error);
          adminData = undefined;
        }
      }

      // Fetch bans data
      if (fetchConfig.fetchBansData) {
        try {
          const placeholdersSteamIds = steamIds.map(() => "?").join(",");

          // Fetch bans where user is banned
          const bansQuery = `SELECT * FROM simple_admin.sa_bans WHERE player_steamid IN (${placeholdersSteamIds})`;
          const [banRows] = await poolServer2.execute<RowDataPacket[]>(
            bansQuery,
            steamIds
          );

          // Fetch bans where user's IPs are banned
          let ipBanRows: RowDataPacket[] = [];
          if (allUserIPs.length > 0) {
            const placeholdersIPs = allUserIPs.map(() => "?").join(",");
            const ipBansQuery = `SELECT * FROM simple_admin.sa_bans WHERE player_ip IN (${placeholdersIPs})`;
            const [ipBanRowsResult] = await poolServer2.execute<
              RowDataPacket[]
            >(ipBansQuery, allUserIPs);
            ipBanRows = ipBanRowsResult;
          }

          bansData = {
            totalBans: banRows.length + ipBanRows.length,
            banRecords: banRows as BanRecord[],
            ipBans: ipBanRows as BanRecord[],
            banServers: [], // Assuming an empty array for 'banServers' to fix the missing property error
          };
        } catch (error) {
          console.error("Error fetching bans data from Server2:", error);
          bansData = undefined;
        }
      }

      // Fetch mutes data
      if (fetchConfig.fetchMutesData) {
        try {
          const placeholdersSteamIds = steamIds.map(() => "?").join(",");

          // Fetch mutes where user is muted
          const mutesQuery = `SELECT * FROM simple_admin.sa_mutes WHERE player_steamid IN (${placeholdersSteamIds})`;
          const [muteRows] = await poolServer2.execute<RowDataPacket[]>(
            mutesQuery,
            steamIds
          );

          const muteServersQuery = `SELECT DISTINCT server_id FROM simple_admin.sa_mutes WHERE player_steamid IN (${placeholdersSteamIds})`;
          const [muteServersRows] = await poolServer2.execute<RowDataPacket[]>(
            muteServersQuery,
            steamIds
          );

          mutesData = {
            totalMutes: muteRows.length,
            muteRecords: muteRows as MuteRecord[],
            muteServers: muteServersRows.map((row) => row.server_id),
          };
        } catch (error) {
          console.error("Error fetching mutes data from Server2:", error);
          mutesData = undefined;
        }
      }

      // Fetch servers data
      if (fetchConfig.fetchServersData) {
        try {
          const placeholdersSteamIds = steamIds.map(() => "?").join(",");

          // Fetch user_activity to get servers the user has connected to
          const userActivityQuery = `SELECT DISTINCT ip_address FROM activity_tracking.user_activity WHERE steam_id IN (${placeholdersSteamIds})`;
          const [userActivityRows] = await poolServer2.execute<RowDataPacket[]>(
            userActivityQuery,
            steamIds
          );

          const serverIPs = userActivityRows.map((row) => row.ip_address);

          if (serverIPs.length > 0) {
            const placeholdersServerIPs = serverIPs.map(() => "?").join(",");
            const serversQuery = `SELECT * FROM server_list.servers WHERE ip IN (${placeholdersServerIPs})`;
            const [serverRows] = await poolServer2.execute<RowDataPacket[]>(
              serversQuery,
              serverIPs
            );
            serversData = {
              connectedServers: serverRows as ServerInfo[],
            };
          } else {
            serversData = {
              connectedServers: [] as ServerInfo[],
            };
          }
        } catch (error) {
          console.error("Error fetching servers data from Server2:", error);
          serversData = undefined;
        }
      }

      // Fetch potential alt accounts
      if (fetchConfig.fetchAdditionalData) {
        try {
          if (allUserIPs.length > 0) {
            const placeholdersIPs = allUserIPs.map(() => "?").join(",");
            const altAccountsQuery = `SELECT DISTINCT user_id FROM device_ips WHERE ip_address IN (${placeholdersIPs}) AND user_id != ?`;
            const [altAccountRows] = await poolServer1.execute<RowDataPacket[]>(
              altAccountsQuery,
              [...allUserIPs, uid]
            );
            potentialAltAccounts = altAccountRows.map((row) =>
              row.user_id.toString()
            );
          }
        } catch (error) {
          console.error(
            "Error fetching potential alt accounts from Server1:",
            error
          );
          potentialAltAccounts = [];
        }

        // Fetch devices used
        devicesUsed = devicesWithIPs.map((device) => ({
          deviceName: device.device_name,
          firstLogin: device.first_login,
          lastLogin: device.last_login,
          isLoggedIn: device.is_logged_in,
          ips: device.ips.map((ip) => ip.ip_address),
        }));

        // Recent activity (can be subset of activityLogRows)
        recentActivity = activityLogRows.slice(-10); // Last 10 activities
      }
    }

    // Construct the ultimate response structure
    const responseData: UserDataResponse = {
      user: {
        ...user,
        profile: profile,
      },
    };

    // Include activity data if fetched
    if (
      fetchConfig.fetchActivityLog ||
      fetchConfig.fetchDevices ||
      fetchConfig.fetchLoginLogs ||
      fetchConfig.fetchLoginTokens
    ) {
      responseData.activity = {
        logs: fetchConfig.fetchActivityLog ? activityLogRows : undefined,
        devices: fetchConfig.fetchDevices ? devicesWithIPs : undefined,
        loginLogs: fetchConfig.fetchLoginLogs ? loginLogRows : undefined,
        loginTokens: fetchConfig.fetchLoginTokens ? loginTokenRows : undefined,
      };
    }

    // Include payments data if fetched
    if (fetchConfig.fetchPayments || fetchConfig.fetchCheckoutDetails) {
      responseData.payments = {
        made: fetchConfig.fetchPayments
          ? paymentRows.filter((payment) => payment.payer_user_id == +uid)
          : undefined,
        received: fetchConfig.fetchPayments
          ? paymentRows.filter((payment) => payment.recipient_user_id == +uid)
          : undefined,
        checkoutDetails: fetchConfig.fetchCheckoutDetails
          ? checkoutRows
          : undefined,
      };
    }

    // Include gameStats if fetched
    if (fetchConfig.fetchGameStats && gameStats) {
      responseData.user.gameStats = gameStats;
    }

    // Include adminData if fetched
    if (fetchConfig.fetchAdminData && adminData) {
      responseData.adminData = adminData;
    }

    // Include bans data if fetched
    if (fetchConfig.fetchBansData && bansData) {
      responseData.bans = bansData;
    }

    // Include mutes data if fetched
    if (fetchConfig.fetchMutesData && mutesData) {
      responseData.mutes = mutesData;
    }

    // Include servers data if fetched
    if (fetchConfig.fetchServersData && serversData) {
      responseData.servers = serversData;
    }

    // Include additionalData if fetched
    if (fetchConfig.fetchAdditionalData) {
      responseData.potentialAltAccounts = potentialAltAccounts;
      responseData.devicesUsed = devicesUsed;
      responseData.recentActivity = recentActivity;
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
