import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Flame } from 'lucide-react';

interface UserStatsProps {
  isLoggedIn: boolean;
  isSteamLinked: boolean;
  hasServerData: boolean;
  hasCompletedOnboarding: boolean;
  userStats?: {
    rating: number;
    pointsToNextRank: number;
    progressToNextRank: number; // Percentage value (0-100)
    totalJumps: number;
    avgSpeed: number;
    favoriteMap: string;
    rank: number;
    rankPercentage: string;
    xp: number;
    maxXp: number;
    level: number;
  } | null;
}

const UserStatsCard: React.FC<UserStatsProps> = ({
  isLoggedIn,
  isSteamLinked,
  hasServerData,
  hasCompletedOnboarding,
  userStats,
}) => {
  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Flame className="mr-2 h-5 w-5 text-red-500" />
          Your Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isLoggedIn ? (
          <p className="text-center text-yellow-500">
            Please log in to see your stats.
          </p>
        ) : !hasCompletedOnboarding ? (
          <p className="text-center text-yellow-500">
            Please complete your onboarding to proceed.
          </p>
        ) : !isSteamLinked ? (
          <p className="text-center text-yellow-500">
            Please link your Steam account to view your detailed stats.
          </p>
        ) : !hasServerData ? (
          <p className="text-center text-yellow-500">
            No server data found for your Steam account. Play on our server to generate stats.
          </p>
        ) : userStats ? (
          <div className="space-y-4 text-zinc-300">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold">Your rating:</span>
              <div className="flex items-center bg-gradient-to-r from-red-600 to-red-400 px-3 py-1 rounded-full">
                <span className="text-white font-bold text-base">{userStats.rating}</span>
              </div>
            </div>
            <div className="bg-zinc-900 p-4 rounded-lg">
              <div className="text-2xl font-bold text-center text-red-400 mb-2">
                {userStats.pointsToNextRank}
              </div>
              <div className="text-sm text-center text-zinc-400 mb-3">Points to next rank</div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-zinc-700">
                  <div
                    style={{ width: `${userStats.progressToNextRank}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                  ></div>
                </div>
              </div>
              <div className="text-right text-sm mt-1 text-zinc-400">
                {userStats.pointsToNextRank} points left
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900 p-2 rounded-lg">
                <p className="text-sm font-semibold mb-1">Total Jumps</p>
                <p className="text-lg text-red-400">{userStats.totalJumps}</p>
              </div>
              <div className="bg-zinc-900 p-2 rounded-lg">
                <p className="text-sm font-semibold mb-1">Avg. Speed</p>
                <p className="text-lg text-red-400">{userStats.avgSpeed} u/s</p>
              </div>
            </div>
            <div className="bg-zinc-900 p-2 rounded-lg">
              <p className="text-sm font-semibold mb-1">Favorite Map</p>
              <p className="text-base text-red-400">{userStats.favoriteMap}</p>
            </div>
            <div className="bg-zinc-900 p-2 rounded-lg">
              <p className="text-sm font-semibold mb-1">Rank</p>
              <p className="text-base text-red-400">
                #{userStats.rank} <span className="text-xs text-zinc-400">(Top {userStats.rankPercentage}%)</span>
              </p>
            </div>
            <div className="bg-zinc-900 p-2 rounded-lg">
              <p className="text-sm font-semibold mb-1">XP and Level</p>
              <p className="text-base text-red-400 mb-1">Level {userStats.level}</p>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-zinc-700">
                  <div
                    style={{ width: `${(userStats.xp / userStats.maxXp) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
              <p className="text-xs mt-1 text-zinc-400">
                {userStats.xp} / {userStats.maxXp} XP
              </p>
            </div>
          </div>
        ) : null}
        <Button className="w-full mt-4">View Detailed Stats</Button>
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;
