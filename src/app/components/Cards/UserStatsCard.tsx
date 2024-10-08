import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Flame, ArrowUp } from 'lucide-react';

interface UserStatsProps {
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
}

const UserStatsCard: React.FC<UserStatsProps> = ({
  rating,
  pointsToNextRank,
  progressToNextRank,
  totalJumps,
  avgSpeed,
  favoriteMap,
  rank,
  rankPercentage,
  xp,
  maxXp,
  level,
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
        <div className="space-y-4 text-zinc-300">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold">Your rating:</span>
            <div className="flex items-center bg-gradient-to-r from-red-600 to-red-400 px-3 py-1 rounded-full">
              <span className="text-white font-bold text-base">{rating}</span>
              <ArrowUp className="ml-1 h-4 w-4 text-green-300" />
            </div>
          </div>
          <div className="bg-zinc-900 p-4 rounded-lg">
            <div className="text-2xl font-bold text-center text-red-400 mb-2">
              {pointsToNextRank}
            </div>
            <div className="text-sm text-center text-zinc-400 mb-3">Points to next rank</div>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-zinc-700">
                <div style={{ width: `${progressToNextRank}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
              </div>
            </div>
            <div className="text-right text-sm mt-1 text-zinc-400">{pointsToNextRank} points left</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900 p-2 rounded-lg">
              <p className="text-sm font-semibold mb-1">Total Jumps</p>
              <p className="text-lg text-red-400">{totalJumps}</p>
              <p className="text-xs text-green-500">+5% from last 24h</p>
            </div>
            <div className="bg-zinc-900 p-2 rounded-lg">
              <p className="text-sm font-semibold mb-1">Avg. Speed</p>
              <p className="text-lg text-red-400">{avgSpeed} u/s</p>
              <p className="text-xs text-red-500">-2% from last 24h</p>
            </div>
          </div>
          <div className="bg-zinc-900 p-2 rounded-lg">
            <p className="text-sm font-semibold mb-1">Favorite Map</p>
            <p className="text-base text-red-400">{favoriteMap}</p>
          </div>
          <div className="bg-zinc-900 p-2 rounded-lg">
            <p className="text-sm font-semibold mb-1">Rank</p>
            <p className="text-base text-red-400">#{rank} <span className="text-xs text-zinc-400">(Top {rankPercentage}%)</span></p>
            <p className="text-xs text-green-500">Up 3 positions in 24h</p>
          </div>
          <div className="bg-zinc-900 p-2 rounded-lg">
            <p className="text-sm font-semibold mb-1">XP and Level</p>
            <p className="text-base text-red-400 mb-1">Level {level}</p>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-zinc-700">
                <div style={{ width: `${(xp / maxXp) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>
            <p className="text-xs mt-1 text-zinc-400">{xp} / {maxXp} XP</p>
          </div>
        </div>
        <Button className="w-full mt-4">View Detailed Stats</Button>
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;