import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { Award, Headphones, Trophy, Activity, Cctv } from 'lucide-react'

const UserProfileCard: React.FC = () => {
  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-white">User Profile</CardTitle>
        <Button variant="default" className="px-4">
          View Profile
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <img src="https://avatars.akamai.steamstatic.com/0bfd6a007df7f197f6b622848c60547bc3e611a0_full.jpg" alt="Steam Avatar" className="w-20 h-20 border border-zinc-700 rounded-md" />
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-white mb-2">Low</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-zinc-400"><span className="font-semibold text-zinc-300">Surf Maps Completed:</span> <span className="text-red-400">42</span></p>
                <p className="text-zinc-400"><span className="font-semibold text-zinc-300">Total Playtime:</span> <span className="text-red-400">120 hours</span></p>
              </div>
              <div className="text-right">
                <p className="text-zinc-300 font-semibold">Rank: <span className="text-red-400">#42</span></p>
                <p className="text-zinc-400 text-sm">Top 5%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
        <h3 className="text-xl text-white font-bold mb-2 bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
    Recent Achievements
  </h3>          <div className="flex space-x-2">
  {[
    <Award className="h-6 w-6 text-yellow-500/90" />,
    <Cctv className="h-6 w-6 text-green-500/90" />,
    <Activity className="h-6 w-6 text-purple-500/90" />,
    <Headphones className="h-6 w-6 text-blue-500/90" />,
    <Trophy className="h-6 w-6 text-orange-500/90" />,
  ].map((Icon, i) => (
    <TooltipProvider key={i}>
      <Tooltip>
        <TooltipTrigger>
          <div className="bg-zinc-900 p-2 rounded-full">
            {Icon}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Achievement {i + 1}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ))}
</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserProfileCard
