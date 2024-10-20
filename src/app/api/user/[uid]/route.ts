import { NextResponse } from "next/server";
import poolServer1 from "@/app/lib/dbServer1";
import { poolServer2 } from "@/app/lib/dbServer2";
import { RowDataPacket } from "mysql2";
import {
  User,
  UserProfile,
  ActivityLog,
  Device,
  LoginLog,
  LoginToken,
  Payment,
  CheckoutDetail,
  DeviceUsed,
  Profile,
  DeviceIP,
  AdditionalData,
} from "@/app/interfaces/server1";
import {
  GameStats,
  AdminData,
  BansData,
  MutesData,
  ServersData,
} from "@/app/interfaces/server2";

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
  gameStats?: GameStats;
  adminData?: AdminData;
  bans?: BansData;
  mutes?: MutesData;
  servers?: ServersData;
  // AdditionalData fields
  potentialAltAccounts?: string[];
  devicesUsed?: DeviceUsed[];
  recentActivity?: ActivityLog[];
}
// Fetch configuration flags
const fetchConfig = {
  fetchProfile: true,
  fetchActivityLog: true,
  fetchDevices: true,
  fetchLoginLogs: true,
  fetchLoginTokens: true,
  fetchPayments: true,
  fetchCheckoutDetails: true,
  fetchGameStats: true,
  fetchAdminData: true,
  fetchBansData: true,
  fetchMutesData: true,
  fetchServersData: true,
  fetchAdditionalData: true,
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
      const [userRows] = await poolServer1.execute<User[]>(
        "SELECT id, email, status, admin, verified, createdAt, updatedAt FROM users WHERE id = ?",
        [uid]
      );

      if (userRows.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      user = userRows[0];
    } catch (error) {
      console.error("Error fetching user data from Server1:", {
        query:
          "SELECT id, email, status, admin, verified, createdAt, updatedAt FROM users WHERE id = ?",
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
        const [profileRows] = await poolServer1.execute<Profile[]>(
          "SELECT username, bio_short, avatar, steam_id, steam_id_64, steam_id_3 FROM profiles WHERE user_id = ?",
          [uid]
        );

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
        const [activityRows] = await poolServer1.execute<ActivityLog[]>(
          "SELECT * FROM activity_log WHERE user_id = ?",
          [uid]
        );
        activityLogRows = activityRows;
      } catch (error) {
        console.error("Error fetching activity log from Server1:", {
          query: "SELECT * FROM activity_log WHERE user_id = ?",
          params: [uid],
          error,
        });
        activityLogRows = [];
      }
    }

    if (fetchConfig.fetchDevices) {
      // Fetch devices and associated IPs
      try {
        const [deviceRows] = await poolServer1.execute<RowDataPacket[]>(
          "SELECT id, device_name, first_login, last_login, is_logged_in FROM devices WHERE user_id = ?",
          [uid]
        );

        // For each device, fetch device_ips
        devicesWithIPs = await Promise.all(
          deviceRows.map(async (device: Omit<Device, "ips">) => {
            try {
              const [ipRows] = await poolServer1.execute<DeviceIP[]>(
                "SELECT id, device_id, ip_address, created_at FROM device_ips WHERE device_id = ?",
                [device.id]
              );

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
            "SELECT id, device_name, first_login, last_login, is_logged_in FROM devices WHERE user_id = ?",
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
        const [loginLogs] = await poolServer1.execute<LoginLog[]>(
          "SELECT * FROM login_logs WHERE user_id = ?",
          [uid]
        );
        loginLogRows = loginLogs;
        loginIPs = loginLogRows.map((log) => log.ip_address);
      } catch (error) {
        console.error("Error fetching login logs from Server1:", {
          query: "SELECT * FROM login_logs WHERE user_id = ?",
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
        const [tokens] = await poolServer1.execute<LoginToken[]>(
          "SELECT * FROM login_tokens WHERE user_id = ?",
          [uid]
        );
        loginTokenRows = tokens;
      } catch (error) {
        console.error("Error fetching login tokens from Server1:", {
          query: "SELECT * FROM login_tokens WHERE user_id = ?",
          params: [uid],
          error,
        });
        loginTokenRows = [];
      }
    }

    if (fetchConfig.fetchPayments) {
      try {
        // Fetch payments where user is payer or recipient
        const [payments] = await poolServer1.execute<Payment[]>(
          "SELECT * FROM payments WHERE payer_user_id = ? OR recipient_user_id = ?",
          [uid, uid]
        );
        paymentRows = payments;
      } catch (error) {
        console.error("Error fetching payments from Server1:", {
          query:
            "SELECT * FROM payments WHERE payer_user_id = ? OR recipient_user_id = ?",
          params: [uid, uid],
          error,
        });
        paymentRows = [];
      }
    }

    if (fetchConfig.fetchCheckoutDetails) {
      try {
        // Fetch user_checkout_details
        const [checkouts] = await poolServer1.execute<CheckoutDetail[]>(
          "SELECT * FROM user_checkout_details WHERE user_id = ?",
          [uid]
        );
        checkoutRows = checkouts;
      } catch (error) {
        console.error("Error fetching checkout details from Server1:", {
          query: "SELECT * FROM user_checkout_details WHERE user_id = ?",
          params: [uid],
          error,
        });
        checkoutRows = [];
      }
    }

    // Prepare data from Server2
    let additionalData: AdditionalData = {
      potentialAltAccounts: [],
      devicesUsed: [],
      recentActivity: [],
    };
    let gameStats: GameStats = {};
    let adminData: AdminData = {
      adminInfo: [],
      adminServers: [],
      bansIssued: 0,
      mutesIssued: 0,
    };
    let bansData: BansData = {
      totalBans: 0,
      banRecords: [],
      ipBans: [],
      banServers: [],
    };
    let mutesData: MutesData = {
      totalMutes: 0,
      muteRecords: [],
      muteServers: [],
    };
    let serversData: ServersData = {
      connectedServers: [],
    };

    // Variables needed outside the scope
    let playermodelRows: any[] = [];
    let activityPlayerRecordsRows: any[] = [];
    let userActivityRows: any[] = [];
    let ipUserActivityRows: any[] = [];

    let playerStatsRows: any[] = [];
    let sharptimerPlayerRecordsRows: any[] = [];
    let playerStageTimesRows: any[] = [];
    let playerReplaysRows: any[] = [];

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

      let adminRows: any[] = [];
      let banRows: any[] = [];
      let adminBanRows: any[] = [];
      let ipBanRows: any[] = [];
      let muteRows: any[] = [];
      let adminMuteRows: any[] = [];
      let adminServers: any[] = [];
      let banServers: any[] = [];
      let muteServers: any[] = [];
      let userConnectedServers: any[] = [];

      if (fetchConfig.fetchGameStats) {
        try {
          // Fetch data from activity_tracking using different SteamIDs
          const placeholdersSteamIds = steamIds.map(() => "?").join(",");

          const playermodelQuery = `SELECT * FROM activity_tracking.playermodelchanger WHERE steamid IN (${placeholdersSteamIds})`;
          try {
            const [playermodelRowsResult] = await poolServer2.execute<any[]>(
              playermodelQuery,
              steamIds
            );
            playermodelRows = playermodelRowsResult;
          } catch (error) {
            console.error("Error fetching playermodel data from Server2:", {
              query: playermodelQuery,
              params: steamIds,
              error,
            });
            playermodelRows = [];
          }

          const activityPlayerRecordsQuery = `SELECT * FROM activity_tracking.PlayerRecords WHERE SteamID IN (${placeholdersSteamIds})`;
          try {
            const [activityPlayerRecordsRowsResult] = await poolServer2.execute<
              any[]
            >(activityPlayerRecordsQuery, steamIds);
            activityPlayerRecordsRows = activityPlayerRecordsRowsResult;
          } catch (error) {
            console.error(
              "Error fetching activity PlayerRecords from Server2:",
              {
                query: activityPlayerRecordsQuery,
                params: steamIds,
                error,
              }
            );
            activityPlayerRecordsRows = [];
          }

          const userActivityQuery = `SELECT * FROM activity_tracking.user_activity WHERE steam_id IN (${placeholdersSteamIds})`;
          try {
            const [userActivityRowsResult] = await poolServer2.execute<any[]>(
              userActivityQuery,
              steamIds
            );
            userActivityRows = userActivityRowsResult;
          } catch (error) {
            console.error("Error fetching user activity from Server2:", {
              query: userActivityQuery,
              params: steamIds,
              error,
            });
            userActivityRows = [];
          }

          // Also fetch user_activity where ip_address matches user's IPs
          if (allUserIPs.length > 0) {
            const placeholdersIPs = allUserIPs.map(() => "?").join(",");
            const ipUserActivityQuery = `SELECT * FROM activity_tracking.user_activity WHERE ip_address IN (${placeholdersIPs})`;
            try {
              const [ipUserActivityRowsResult] = await poolServer2.execute<
                any[]
              >(ipUserActivityQuery, allUserIPs);
              ipUserActivityRows = ipUserActivityRowsResult;
            } catch (error) {
              console.error("Error fetching IP user activity from Server2:", {
                query: ipUserActivityQuery,
                params: allUserIPs,
                error,
              });
              ipUserActivityRows = [];
            }
          }

          // Fetch PlayerStats from sharptimer
          const playerStatsQuery = `SELECT * FROM sharptimer.PlayerStats WHERE SteamID IN (${placeholdersSteamIds})`;
          try {
            const [playerStatsRowsResult] = await poolServer2.execute<any[]>(
              playerStatsQuery,
              steamIds
            );
            playerStatsRows = playerStatsRowsResult;
          } catch (error) {
            console.error("Error fetching PlayerStats from Server2:", {
              query: playerStatsQuery,
              params: steamIds,
              error,
            });
            playerStatsRows = [];
          }

          // Fetch PlayerRecords from sharptimer
          const sharptimerPlayerRecordsQuery = `SELECT * FROM sharptimer.PlayerRecords WHERE SteamID IN (${placeholdersSteamIds})`;
          try {
            const [sharptimerPlayerRecordsRowsResult] =
              await poolServer2.execute<any[]>(
                sharptimerPlayerRecordsQuery,
                steamIds
              );
            sharptimerPlayerRecordsRows = sharptimerPlayerRecordsRowsResult;
          } catch (error) {
            console.error(
              "Error fetching sharptimer PlayerRecords from Server2:",
              {
                query: sharptimerPlayerRecordsQuery,
                params: steamIds,
                error,
              }
            );
            sharptimerPlayerRecordsRows = [];
          }

          // Fetch PlayerStageTimes
          const playerStageTimesQuery = `SELECT * FROM sharptimer.PlayerStageTimes WHERE SteamID IN (${placeholdersSteamIds})`;
          try {
            const [playerStageTimesRowsResult] = await poolServer2.execute<
              any[]
            >(playerStageTimesQuery, steamIds);
            playerStageTimesRows = playerStageTimesRowsResult;
          } catch (error) {
            console.error("Error fetching PlayerStageTimes from Server2:", {
              query: playerStageTimesQuery,
              params: steamIds,
              error,
            });
            playerStageTimesRows = [];
          }

          // Fetch PlayerReplays
          //   const playerReplaysQuery = `SELECT MapName, SteamID, Style, Replay FROM sharptimer.PlayerReplays WHERE SteamID IN (76561198123975074)`;

          //     const startTime = Date.now();
          //     const sanitizedSteamIds = steamIds.map(id => id.toString().trim());
          //     try {
          //     const [playerReplaysRowsResult] = await poolServer2.execute<PlayerReplay[]>(
          //         playerReplaysQuery
          //     );
          //     playerReplaysRows = playerReplaysRowsResult;
          //     const endTime = Date.now();
          //     console.log(`PlayerReplays query executed in ${endTime - startTime}ms`);
          //     } catch (error) {
          //     console.error('Error fetching PlayerReplays from Server2:', {
          //         query: playerReplaysQuery,
          //         params: sanitizedSteamIds,
          //         error,
          //     });
          //     playerReplaysRows = [];
          //     }
        } catch (error) {
          console.error("Error fetching game stats data from Server2:", error);
          playermodelRows = [];
          activityPlayerRecordsRows = [];
          userActivityRows = [];
          ipUserActivityRows = [];
          playerStatsRows = [];
          sharptimerPlayerRecordsRows = [];
          playerStageTimesRows = [];
          //   playerReplaysRows = [];
        }
      }

      if (
        fetchConfig.fetchAdminData ||
        fetchConfig.fetchBansData ||
        fetchConfig.fetchMutesData
      ) {
        const placeholdersSteamIds = steamIds.map(() => "?").join(",");

        if (fetchConfig.fetchAdminData) {
          try {
            // Fetch sa_admins
            const adminQuery = `SELECT * FROM simple_admin.sa_admins WHERE player_steamid IN (${placeholdersSteamIds})`;
            const [adminRowsResult] = await poolServer2.execute<any[]>(
              adminQuery,
              steamIds
            );
            adminRows = adminRowsResult;

            // Fetch server details for servers where the user is an admin
            if (adminRows.length > 0) {
              const serverIds = adminRows
                .map((admin: any) => admin.server_id)
                .filter((id: any) => id !== null && id !== undefined);

              const uniqueServerIds = Array.from(new Set(serverIds));

              if (uniqueServerIds.length > 0) {
                const placeholdersServerIds = uniqueServerIds
                  .map(() => "?")
                  .join(",");
                const adminServersQuery = `SELECT * FROM simple_admin.sa_servers WHERE id IN (${placeholdersServerIds})`;
                const [serverRows] = await poolServer2.execute<any[]>(
                  adminServersQuery,
                  uniqueServerIds
                );

                adminServers = serverRows;
              }
            }
          } catch (error) {
            console.error("Error fetching admin data from Server2:", {
              query:
                "SELECT * FROM simple_admin.sa_admins WHERE player_steamid IN (?)",
              params: steamIds,
              error,
            });
            adminRows = [];
            adminServers = [];
          }
        }

        if (fetchConfig.fetchBansData) {
          try {
            // Fetch sa_bans where user is the target
            const banQuery = `SELECT * FROM simple_admin.sa_bans WHERE player_steamid IN (${placeholdersSteamIds})`;
            const [banRowsResult] = await poolServer2.execute<any[]>(
              banQuery,
              steamIds
            );
            banRows = banRowsResult;

            // Fetch sa_bans where user is the admin
            const adminBanQuery = `SELECT * FROM simple_admin.sa_bans WHERE admin_steamid IN (${placeholdersSteamIds})`;
            const [adminBanRowsResult] = await poolServer2.execute<any[]>(
              adminBanQuery,
              steamIds
            );
            adminBanRows = adminBanRowsResult;

            // Fetch sa_bans where player_ip matches user's IPs
            if (allUserIPs.length > 0) {
              const placeholdersIPs = allUserIPs.map(() => "?").join(",");
              const ipBanQuery = `SELECT * FROM simple_admin.sa_bans WHERE player_ip IN (${placeholdersIPs})`;
              const [ipBanRowsResult] = await poolServer2.execute<any[]>(
                ipBanQuery,
                allUserIPs
              );
              ipBanRows = ipBanRowsResult;
            }
          } catch (error) {
            console.error("Error fetching bans data from Server2:", {
              query:
                "SELECT * FROM simple_admin.sa_bans WHERE player_steamid IN (?) OR admin_steamid IN (?) OR player_ip IN (?)",
              params: [...steamIds, ...steamIds, ...allUserIPs],
              error,
            });
            banRows = [];
            adminBanRows = [];
            ipBanRows = [];
          }

          try {
            // Fetch server details for bans where user is admin or target or IP matches
            const banServerIds = [...banRows, ...adminBanRows, ...ipBanRows]
              .map((ban: any) => ban.server_id)
              .filter((id: any) => id !== null && id !== undefined);

            const uniqueBanServerIds = Array.from(new Set(banServerIds));

            if (uniqueBanServerIds.length > 0) {
              const placeholdersServerIds = uniqueBanServerIds
                .map(() => "?")
                .join(",");
              const banServersQuery = `SELECT * FROM simple_admin.sa_servers WHERE id IN (${placeholdersServerIds})`;
              const [serverRows] = await poolServer2.execute<any[]>(
                banServersQuery,
                uniqueBanServerIds
              );
              banServers = serverRows;
            }
          } catch (error) {
            console.error("Error fetching ban servers from Server2:", {
              query: "SELECT * FROM simple_admin.sa_servers WHERE id IN (?)",
              error,
            });
            banServers = [];
          }
        }

        if (fetchConfig.fetchMutesData) {
          try {
            // Fetch sa_mutes where user is the target
            const muteQuery = `SELECT * FROM simple_admin.sa_mutes WHERE player_steamid IN (${placeholdersSteamIds})`;
            const [muteRowsResult] = await poolServer2.execute<any[]>(
              muteQuery,
              steamIds
            );
            muteRows = muteRowsResult;

            // Fetch sa_mutes where user is the admin
            const adminMuteQuery = `SELECT * FROM simple_admin.sa_mutes WHERE admin_steamid IN (${placeholdersSteamIds})`;
            const [adminMuteRowsResult] = await poolServer2.execute<any[]>(
              adminMuteQuery,
              steamIds
            );
            adminMuteRows = adminMuteRowsResult;
          } catch (error) {
            console.error("Error fetching mutes data from Server2:", {
              query:
                "SELECT * FROM simple_admin.sa_mutes WHERE player_steamid IN (?) OR admin_steamid IN (?)",
              params: [...steamIds, ...steamIds],
              error,
            });
            muteRows = [];
            adminMuteRows = [];
          }

          try {
            // Fetch server details for mutes
            const muteServerIds = [...muteRows, ...adminMuteRows]
              .map((mute: any) => mute.server_id)
              .filter((id: any) => id !== null && id !== undefined);

            const uniqueMuteServerIds = Array.from(new Set(muteServerIds));

            if (uniqueMuteServerIds.length > 0) {
              const placeholdersServerIds = uniqueMuteServerIds
                .map(() => "?")
                .join(",");
              const muteServersQuery = `SELECT * FROM simple_admin.sa_servers WHERE id IN (${placeholdersServerIds})`;
              const [serverRows] = await poolServer2.execute<any[]>(
                muteServersQuery,
                uniqueMuteServerIds
              );
              muteServers = serverRows;
            }
          } catch (error) {
            console.error("Error fetching mute servers from Server2:", {
              query: "SELECT * FROM simple_admin.sa_servers WHERE id IN (?)",
              error,
            });
            muteServers = [];
          }

          // Construct mutesData without ipMutes
          mutesData = {
            totalMutes: muteRows.length + adminMuteRows.length,
            muteRecords: [...muteRows, ...adminMuteRows],
            muteServers: muteServers,
          };
        }
      }

      if (fetchConfig.fetchServersData) {
        try {
          if (userActivityRows.length > 0) {
            const serverIPs = userActivityRows
              .map((activity: any) => activity.ip_address)
              .filter((ip: any) => ip !== null && ip !== undefined);

            const uniqueServerIPs = Array.from(new Set(serverIPs));

            if (uniqueServerIPs.length > 0) {
              const placeholdersServerIPs = uniqueServerIPs
                .map(() => "?")
                .join(",");
              const serversQuery = `SELECT * FROM server_list.servers WHERE ip IN (${placeholdersServerIPs})`;
              const [serverRows] = await poolServer2.execute<any[]>(
                serversQuery,
                uniqueServerIPs
              );

              userConnectedServers = serverRows;
            }
          }
        } catch (error) {
          console.error("Error fetching connected servers from Server2:", {
            query: "SELECT * FROM server_list.servers WHERE ip IN (?)",
            params: userActivityRows.map(
              (activity: any) => activity.ip_address
            ),
            error,
          });
          userConnectedServers = [];
        }
      }

      // Additional processing for gameStats, adminData, etc.
      // ...
    }

    // Construct the ultimate response structure
    const responseData: any = {
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
    if (fetchConfig.fetchGameStats) {
      responseData.gameStats = {
        ...gameStats,
        playermodelChanger: playermodelRows[0] || null,
        sharptimerPlayerStats: playerStatsRows,
        sharptimerPlayerRecords: sharptimerPlayerRecordsRows,
        playerStageTimes: playerStageTimesRows,
        playerReplays: playerReplaysRows,
      };
    }

    // Include adminData if fetched
    if (fetchConfig.fetchAdminData) {
      responseData.adminData = adminData;
    }

    // Include bans data if fetched
    if (fetchConfig.fetchBansData) {
      responseData.bans = bansData;
    }

    // Include mutes data if fetched
    if (fetchConfig.fetchMutesData) {
      responseData.mutes = mutesData;
    }

    // Include servers data if fetched
    if (fetchConfig.fetchServersData) {
      responseData.servers = serversData;
    }

    // Include additionalData if fetched
    if (fetchConfig.fetchAdditionalData) {
      Object.assign(responseData, additionalData);
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
