// components/Cards/RecentPostsCard.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { MessageSquare } from 'lucide-react';
import { Button } from '@components/ui/button';
import RelativeTime from '@components/Shared/RelativeTime';
import { useFeatureFlags } from '@context/FeatureFlagContext';
import { FeatureFlagKeys } from '@utils/featureFlags';

interface RecentPost {
  title: string;
  author: string;
  thread: string;
  timestamp: Date;
}

interface RecentPostsCardProps {
  recentPosts: RecentPost[];
}

const RecentPostsCard: React.FC<RecentPostsCardProps> = ({ recentPosts }) => {
  const { isFeatureEnabled } = useFeatureFlags();

  // If the RecentPostsCard feature flag is disabled, don't render the card
  if (!isFeatureEnabled(FeatureFlagKeys.ENABLE_RECENTPOSTS_CARD)) {
    return null;
  }

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-white flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
          Recent Posts
        </CardTitle>
        {isFeatureEnabled(FeatureFlagKeys.ENABLE_RECENTPOSTS_VIEW_ALL) && (
          <Button variant="link" className="text-red-400">
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isFeatureEnabled(FeatureFlagKeys.ENABLE_RECENTPOSTS_POST_LIST) && (
          <div className="space-y-4">
            {recentPosts.map((post, index) => (
              <div key={index} className="border-b border-zinc-800 pb-3 last:border-b-0 last:pb-0">
                <h4 className="text-sm font-semibold text-white">{post.title}</h4>
                <p className="text-xs text-zinc-400">by {post.author} in {post.thread}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  <RelativeTime date={post.timestamp} />
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentPostsCard;
