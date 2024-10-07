import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Progress } from '@components/ui/progress'
import { Flame, ArrowUp } from 'lucide-react'

const UserStatsCard: React.FC = () => {
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
              <span className="text-white font-bold text-base">16,664</span>
              <ArrowUp className="ml-1 h-4 w-4 text-green-300" />
            </div>
          </div>
          <div className="bg-zinc-900 p-3 rounded-lg">
            <div className="text-2xl font-bold text-center text-red-400 mb-1">
              24,999
            </div>
            <div className="text-xs text-center text-zinc-400 mb-2">Points to next rank</div>
            <Progress value={76} className="h-2" />
            <div className="text-right text-xs mt-1 text-zinc-400">32 points left</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900 p-2 rounded-lg">
              <p className="text-sm font-semibold mb-1">Total Jumps</p>
              <p className="text-lg text-red-400">15,234</p>
              <p className="text-xs text-green-500">+5% from last 24h</p>
            </div>
            <div className="bg-zinc-900 p-2 rounded-lg">
              <p className="text-sm font-semibold mb-1">Avg. Speed</p>
              <p className="text-lg text-red-400">280 u/s</p>
              <p className="text-xs text-red-500">-2% from last 24h</p>
            </div>
          </div>
          <div className="bg-zinc-900 p-2 rounded-lg">
            <p className="text-sm font-semibold mb-1">Favorite Map</p>
            <p className="text-base text-red-400">surf_utopia</p>
          </div>
          <div className="bg-zinc-900 p-2 rounded-lg">
            <p className="text-sm font-semibold mb-1">Rank</p>
            <p className="text-base text-red-400">#42 <span className="text-xs text-zinc-400">(Top 5%)</span></p>
            <p className="text-xs text-green-500">Up 3 positions in 24h</p>
          </div>
          <div className="bg-zinc-900 p-2 rounded-lg">
            <p className="text-sm font-semibold mb-1">XP and Level</p>
            <p className="text-base text-red-400 mb-1">Level 15</p>
            <Progress value={62.5} className="h-2" />
            <p className="text-xs mt-1 text-zinc-400">1,250 / 2,000 XP</p>
          </div>
        </div>
        <Button className="w-full mt-4">View Detailed Stats</Button>
      </CardContent>
    </Card>
  )
}

export default UserStatsCard
