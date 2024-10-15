// components/Cards/LiveFeedCard.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Maximize2 } from 'lucide-react';
import LiveFeedItem from '@components/Shared/LiveFeedItem';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog';
import { useFeatureFlags } from '@context/FeatureFlagContext';
import { FeatureFlagKeys } from '@utils/featureFlags';

interface Event {
  type: string;
  user?: string;
  details: string;
  timestamp: Date;
  icon: JSX.Element;
  isModerator?: boolean;
}

interface LiveFeedCardProps {
  recentEvents: Event[];
}

const LiveFeedCard: React.FC<LiveFeedCardProps> = ({ recentEvents }) => {
  const { isFeatureEnabled } = useFeatureFlags();

  // If the LiveFeedCard feature flag is disabled, don't render the card
  if (!isFeatureEnabled(FeatureFlagKeys.ENABLE_LIVEFEED_CARD)) {
    return null;
  }

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-white text-left">Live Feed</CardTitle>
        {isFeatureEnabled(FeatureFlagKeys.ENABLE_LIVEFEED_DIALOG) && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-white">
                <Maximize2 className="h-5 w-5" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Live Feed</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {recentEvents.map((event, index) => (
                  <LiveFeedItem key={index} event={event} />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentEvents.slice(0, 5).map((event, index) => (
            <LiveFeedItem key={index} event={event} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveFeedCard;
