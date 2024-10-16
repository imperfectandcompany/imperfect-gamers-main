// components/Cards/UserProfileCard.tsx

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { useFeatureFlags } from "@context/FeatureFlagContext";
import { FeatureFlagKeys } from "@utils/featureFlags";

interface Achievement {
  icon: string;
  title: string;
  description: string;
  date: string;
}

interface UserProfileProps {
  isLoggedIn: boolean;
  isSteamLinked: boolean;
  hasServerData: boolean;
  userName?: string;
  avatarUrl?: string;
  surfMapsCompleted?: number;
  totalPlaytime?: string;
  totalMuteTime?: string;
  totalBans?: number;
  rank?: number;
  rankPercentage?: string;
  achievements?: Achievement[];
  isVerified?: boolean;
}

const UserProfileCard: React.FC<UserProfileProps> = ({
  isLoggedIn,
  isSteamLinked,
  hasServerData,
  userName,
  avatarUrl,
  surfMapsCompleted,
  totalPlaytime,
  totalMuteTime,
  totalBans,
  rank,
  rankPercentage,
  achievements,
  isVerified,
}) => {
  const { isFeatureEnabled } = useFeatureFlags();

  if (!isLoggedIn) {
    return (
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-white">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <span className="text-6xl block mb-4">👤</span>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome, Guest!
            </h2>
            <p className="text-zinc-400 mb-4">
              Log in to view your profile and stats.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userName) {
    return (
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-white">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <span className="text-6xl block mb-4">👤</span>
            <p className="text-yellow-500 font-semibold">
              Username not set - Please complete your onboarding.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-white">
          <span>User Profile</span>
          {!isVerified && (
            <span className="px-2 py-1 text-xs font-semibold text-yellow-500 bg-zinc-700 rounded-full">
              Not Verified
            </span>
          )}
        </CardTitle>
        <Button variant="default">
          View Profile
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <img
            src={avatarUrl}
            alt="Steam Avatar"
            className="w-20 h-20 rounded-full"
          />
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-white mb-2">{userName}</h2>
            {!isSteamLinked ? (
              <p className="text-yellow-500">
                Please link your Steam account to view detailed stats.
              </p>
            ) : hasServerData ? (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-zinc-400">
                      <span className="font-semibold text-zinc-300">
                        Surf Maps Completed:
                      </span>{" "}
                      <span className="text-red-400">
                        {surfMapsCompleted}/100
                      </span>
                    </p>
                    <p className="text-zinc-400">
                      <span className="font-semibold text-zinc-300">
                        Total Playtime:
                      </span>{" "}
                      <span className="text-red-400">{totalPlaytime}</span>
                    </p>
                    <p className="text-zinc-400">
                      <span className="font-semibold text-zinc-300">
                        Total Mute Time:
                      </span>{" "}
                      <span className="text-yellow-400">{totalMuteTime}</span>
                    </p>
                    <p className="text-zinc-400">
                      <span className="font-semibold text-zinc-300">
                        Total Bans:
                      </span>{" "}
                      <span className="text-red-400">{totalBans}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    {isFeatureEnabled(FeatureFlagKeys.ENABLE_USERPROFILE_RANK) && (
                      <>
                        <p className="text-zinc-300 font-semibold">
                          Rank: <span className="text-red-400">#{rank}</span>
                        </p>
                        <p className="text-zinc-400 text-sm">
                          Top {rankPercentage}%
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {isFeatureEnabled(FeatureFlagKeys.ENABLE_USERPROFILE_STATS) && (
                  <div className="mt-4">
                    <p className="text-zinc-400">
                      <span className="font-semibold text-zinc-300">
                        Achievements:
                      </span>{" "}
                      {achievements?.length || 0}
                    </p>
                    <p className="text-zinc-400">
                      <span className="font-semibold text-zinc-300">
                        Playtime:
                      </span>{" "}
                      {totalPlaytime}
                    </p>
                  </div>
                )}

                {isFeatureEnabled(FeatureFlagKeys.ENABLE_USERPROFILE_ACHIEVEMENTS) && achievements && achievements.length > 0 && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-white">
                        Recent Achievements
                      </h3>
                      <Button variant="link" className="text-red-400 text-sm p-0">
                        All Achievements
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {achievements.slice(0, 3).map((achievement, index) => (
                        <div
                          key={index}
                          className="bg-zinc-900 p-3 rounded-lg flex items-center space-x-3"
                        >
                          <div className="text-3xl">{achievement.icon}</div>
                          <div>
                            <p className="font-semibold text-sm text-white">
                              {achievement.title}
                            </p>
                            <p className="text-xs text-zinc-400">
                              {achievement.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-yellow-500">
                No server data found for your Steam account.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
