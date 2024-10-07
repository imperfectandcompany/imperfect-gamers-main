import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { motion } from 'framer-motion'
import Icons from '@components/Shared/Icons'

const ServerStatusCard: React.FC = () => {
  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="flex flex-row space-x-1">
        <div className="w-8 h-8 relative mr-4">
          <div className="absolute inset-0 rounded-full border-2 border-zinc-700"></div>
          <div className="absolute inset-0 rounded-full border-2 border-green-500 border-r-transparent rotate-[270deg]"></div>
          <div className="absolute inset-0 rounded-full border-2 border-yellow-500 border-l-transparent border-t-transparent rotate-[270deg]"></div>
        </div>
        <CardTitle className="text-white">Server Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <TooltipProvider>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-zinc-300">Beginner Surf</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
              >
                Join
              </motion.button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-zinc-300">Advanced Surf</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
              >
                Join
              </motion.button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-zinc-300">Rap Battles</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 bg-zinc-800 text-zinc-500 rounded cursor-not-allowed"
                    disabled
                  >
                    Join
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Server is currently restarting</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
        <Button variant="default" className="w-full mt-4">
          View Status Page
          <Icons.ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default ServerStatusCard
