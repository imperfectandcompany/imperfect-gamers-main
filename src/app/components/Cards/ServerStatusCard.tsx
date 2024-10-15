// components/Cards/ServerStatusCard.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import { motion } from 'framer-motion';
import Icons from '@components/Shared/Icons';
import { useFeatureFlags } from '@context/FeatureFlagContext';
import { FeatureFlagKeys } from '@utils/featureFlags';

// Sample server status data, this can be replaced by an API response in the future for dynamic content
const serverStatusData = [
  {
    name: 'Beginner Surf',
    status: 'online',
    joinable: true,
  },
  {
    name: 'Advanced Surf',
    status: 'online',
    joinable: true,
  },
  {
    name: 'Rap Battles',
    status: 'restarting',
    joinable: false,
    tooltipMessage: 'Server is currently restarting',
  },
];

const ServerStatusCard: React.FC = () => {
  const { isFeatureEnabled } = useFeatureFlags();

  // If the ServerStatusCard feature flag is disabled, don't render the card
  if (!isFeatureEnabled(FeatureFlagKeys.ENABLE_SERVERSTATUS_CARD)) {
    return null;
  }

  // Function to get the color of the status indicator based on server status
  const getStatusColor = (status: string) => {
    console.log('Getting status color for status:', status);
    switch (status) {
      case 'online':
        return 'bg-green-500'; // Green indicates the server is online
      case 'restarting':
        return 'bg-yellow-500'; // Yellow indicates the server is restarting
      default:
        return 'bg-zinc-500'; // Default color for unknown status
    }
  };

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="flex flex-row space-x-1">
        {/* Circular progress indicator for server status */}
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
            {serverStatusData.map((server, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {/* Status indicator color based on server status */}
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)}`}></div>
                  <span className="text-zinc-300">{server.name}</span>
                </div>
                {isFeatureEnabled(FeatureFlagKeys.ENABLE_SERVERSTATUS_JOIN_BUTTON) ? (
                  server.joinable ? (
                    // Join button for joinable servers
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
                    >
                      Join
                    </motion.button>
                  ) : (
                    isFeatureEnabled(FeatureFlagKeys.ENABLE_SERVERSTATUS_TOOLTIPS) ? (
                      // Disabled join button with tooltip for non-joinable servers
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
                          <p>{server.tooltipMessage}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      // If tooltips are disabled, just show a disabled button without tooltip
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 bg-zinc-800 text-zinc-500 rounded cursor-not-allowed"
                        disabled
                      >
                        Join
                      </motion.button>
                    )
                  )
                ) : null}
              </div>
            ))}
          </TooltipProvider>
        </div>
        {/* Button to view the full status page */}
        {isFeatureEnabled(FeatureFlagKeys.ENABLE_SERVERSTATUS_JOIN_BUTTON) && (
          <Button variant="default" className="w-full mt-4">
            View Status Page
            <Icons.ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ServerStatusCard;
