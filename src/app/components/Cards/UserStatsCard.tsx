// components/Cards/UserStatsCard.tsx

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Flame } from "lucide-react";
import { GameStats, UserRecord } from "../../interfaces/server2"; // Adjust the import path as necessary

interface UserStatsProps {
  isLoggedIn: boolean;
  isSteamLinked: boolean;
  hasServerData: boolean;
  hasCompletedOnboarding: boolean;
  gameStats: GameStats | null;
}

const UserStatsCard: React.FC<UserStatsProps> = ({
  isLoggedIn,
  isSteamLinked,
  hasServerData,
  hasCompletedOnboarding,
  gameStats,
}) => {
  if (!isLoggedIn) {
    return (
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Flame className="mr-2 h-5 w-5 text-red-500" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-yellow-500">
            Please log in to see your stats.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Flame className="mr-2 h-5 w-5 text-red-500" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-yellow-500">
            Please complete your onboarding to proceed.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isSteamLinked) {
    return (
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Flame className="mr-2 h-5 w-5 text-red-500" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-yellow-500">
            Please link your Steam account to view your detailed stats.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!hasServerData) {
    return (
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Flame className="mr-2 h-5 w-5 text-red-500" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-yellow-500">
            No server data found for your Steam account. Play on our server to
            generate stats.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!gameStats) {
    return (
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Flame className="mr-2 h-5 w-5 text-red-500" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-red-500">
            Failed to load your stats. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Flame className="mr-2 h-5 w-5 text-red-500" />
          Your Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-zinc-300">
          {/* Global Points */}
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold">Global Points:</span>
            <div className="flex items-center bg-gradient-to-r from-red-600 to-red-400 px-3 py-1 rounded-full">
              <span className="text-white font-bold text-base">
                {gameStats.globalPoints}
              </span>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-zinc-900 p-4 rounded-lg">
            <p className="text-sm font-semibold mb-1">Maps Completed:</p>
            <p className="text-lg text-red-400">
              {gameStats.mapsCompleted}/{gameStats.totalMaps}
            </p>
            <div className="relative pt-1 mt-2">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-zinc-700">
                <div
                  style={{ width: `${parseFloat(gameStats.completionRate)}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                ></div>
              </div>
              <p className="text-sm text-zinc-400 mt-1">
                Completion Rate: {gameStats.completionRate}
              </p>
            </div>
          </div>
          {/* User Records */}
          <div className="bg-zinc-900 p-4 rounded-lg">
            <p className="text-sm font-semibold mb-2">User Records:</p>
            <ul className="list-disc list-inside text-zinc-400 max-h-60 overflow-y-auto">
              {gameStats.mapRecords.map(
                (record: UserRecord, index: number) => (
                  <li key={index} className="mb-2">
                    <strong>{record.mapName}</strong> - Style: {record.style} -
                    Timer Ticks: {record.timerTicks}
                    {record.stageTimes && record.stageTimes.length > 0 && (
                      <ul className="list-circle list-inside mt-1">
                        {record.stageTimes.map((stage, stageIndex) => (
                          <li key={stageIndex}>
                            Stage {stage.stage}: {stage.formattedTime}{" "}
                            (Velocity: {stage.velocity})
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;
