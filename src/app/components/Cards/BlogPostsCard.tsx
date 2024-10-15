// src/components/BlogPostsCard.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { BookOpen } from 'lucide-react';
import { useFeatureFlags } from '@context/FeatureFlagContext';
import { FeatureFlagKeys } from '@utils/featureFlags';

interface BlogPost {
  title: string;
  date: string;
  excerpt: string;
  author: string;
  readTime: string;
}

interface BlogPostsCardProps {
  blogPosts: BlogPost[];
}

const BlogPostsCard: React.FC<BlogPostsCardProps> = ({ blogPosts }) => {
  const { isFeatureEnabled } = useFeatureFlags();

  // If the BlogPostsCard feature flag is disabled, don't render the card
  if (!isFeatureEnabled(FeatureFlagKeys.ENABLE_BLOG_POSTS_CARD)) {
    return null;
  }

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-white flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
          Blog
        </CardTitle>
        {isFeatureEnabled(FeatureFlagKeys.ENABLE_BLOG_POSTS_VIEW_ALL) && (
          <Button variant="link" className="text-red-400">
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {blogPosts.map((post, index) => (
            <div key={index} className="border-b border-zinc-800 pb-4 last:border-b-0 last:pb-0">
              <h4 className="text-lg font-semibold text-white hover:text-red-400 transition-colors duration-200 cursor-pointer">
                {post.title}
              </h4>
              <p className="text-sm text-zinc-400 mb-2">
                {post.date} · {post.readTime} · by {post.author}
              </p>
              <p className="text-zinc-300 text-sm">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostsCard;
