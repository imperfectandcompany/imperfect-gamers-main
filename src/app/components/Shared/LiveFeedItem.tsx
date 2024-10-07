import React from 'react'
import { Clock, User } from 'lucide-react'
import { motion } from 'framer-motion'
import RelativeTime from '@components/Shared/RelativeTime'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'


interface Event {
  type: string
  user?: string
  details: string
  timestamp: Date
  icon: JSX.Element
  isModerator?: boolean
}

interface LiveFeedItemProps {
  event: Event
}

const LiveFeedItem: React.FC<LiveFeedItemProps> = ({ event }) => {
  const isKeyAction = event.type === 'subscribe' || event.type === 'record'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start space-x-2 text-sm ${isKeyAction ? 'bg-zinc-800 p-2 rounded' : ''}`}
    >
      <div className={`mt-1 ${isKeyAction ? 'text-yellow-500' : 'text-zinc-400'}`}>{event.icon}</div>
      <div className="flex-grow">
        <div className="flex items-center space-x-1">
          {event.user && (
            <>
              <span className={`font-bold ${isKeyAction ? 'text-yellow-500' : 'text-white'}`}>
                {event.user}
              </span>
              {event.isModerator && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <User className="h-4 w-4 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Moderator</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </>
          )}
          <span className={isKeyAction ? 'text-zinc-200' : 'text-zinc-300'}>{event.details}</span>
        </div>
        <div className="text-zinc-400 text-xs flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <RelativeTime date={event.timestamp} />
              </TooltipTrigger>
              <TooltipContent>
                <p>{event.timestamp.toLocaleString()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  )
}

export default LiveFeedItem
