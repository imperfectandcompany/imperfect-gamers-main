import React, { useState } from 'react'
import MainNavbar from '@components/Navbar/MainNavbar'
import Header from '@components/Header/Header'
import UserProfileCard from '@components/Cards/UserProfileCard'
import LiveFeedCard from '@components/Cards/LiveFeedCard'
import RecentPostsCard from '@components/Cards/RecentPostsCard'
import NewsCard from '@components/Cards/NewsCard'
import ChangelogCard from '@components/Cards/ChangelogCard'
import QuickActionsCard from '@components/Cards/QuickActionsCard'
import UserStatsCard from '@components/Cards/UserStatsCard'
import ServerStatusCard from '@components/Cards/ServerStatusCard'
import BlogPostsCard from '@components/Cards/BlogPostsCard'
import Footer from '@components/Footer/Footer'
import CookieBanner from '@components/CookieBanner/CookieBanner'
import AlertBanner from '@components/AlertBanner/AlertBanner'

import Icons from '@components/Shared/Icons';

export default function LandingPage() {
  const [recentEvents, setRecentEvents] = useState([
    { type: 'join', user: 'Player 1', details: 'joined the server', timestamp: new Date(Date.now() - 5 * 60000), icon: <Icons.LogIn className="h-4 w-4" />, isModerator: true },
    { type: 'mute', user: 'Player 2', details: 'got muted for 10 minutes', timestamp: new Date(Date.now() - 15 * 60000), icon: <Icons.Ban className="h-4 w-4" /> },
    { type: 'mapChange', details: 'Map changed from surf_easy to surf_medium on the Beginner server', timestamp: new Date(Date.now() - 30 * 60000), icon: <Icons.Megaphone className="h-4 w-4" /> },
    { type: 'subscribe', user: 'Player 3', details: 'subscribed to premium', timestamp: new Date(Date.now() - 60 * 60000), icon: <Icons.Gift className="h-4 w-4" /> },
    { type: 'record', user: 'Player 4', details: 'beat the map record with a time of 1:23.45', timestamp: new Date(Date.now() - 90 * 60000), icon: <Icons.Trophy className="h-4 w-4" /> },
  ])

  const [recentPosts, setRecentPosts] = useState([
    { title: "Need help with surf_skyworld", author: "NewSurfer123", thread: "Map Help", timestamp: new Date(Date.now() - 30 * 60000) },
    { title: "Awesome surf montage!", author: "ProSurfer99", thread: "Media Showcase", timestamp: new Date(Date.now() - 2 * 60 * 60000) },
    { title: "Tips for improving air strafes?", author: "AirStrafe101", thread: "Tutorials", timestamp: new Date(Date.now() - 4 * 60 * 60000) },
  ])

  const [newsItems, setNewsItems] = useState([
    {
      title: "Summer Surf Championship Announced",
      date: "2024-07-30",
      content: "Get ready for the biggest surf event of the year!",
      reactions: [
        { emoji: <Icons.ThumbsUp className="h-4 w-4" />, count: 45 },
        { emoji: <Icons.Heart className="h-4 w-4" />, count: 23 },
        { emoji: <Icons.Laugh className="h-4 w-4" />, count: 7 },
      ],
    },
  ])

  const [changelog, setChangelog] = useState([
    {
      version: '1.2.3',
      date: '2024-08-01',
      changes: ['Added new surf maps', 'Fixed bug in leaderboard system', 'Improved server performance'],
      reactions: [
        { emoji: <Icons.ThumbsUp className="h-4 w-4" />, count: 15 },
        { emoji: <Icons.Heart className="h-4 w-4" />, count: 7 },
        { emoji: <Icons.Laugh className="h-4 w-4" />, count: 3 },
      ],
    },
  ])

  const [blogPosts, setBlogPosts] = useState([
    {
      title: "Mastering the Art of Surfing",
      date: "2024-07-28",
      excerpt: "Learn the techniques that pro surfers use to dominate the leaderboards.",
      author: "SurfMaster2000",
      readTime: "5 min read",
    },
    {
      title: "The Evolution of Surf Maps",
      date: "2024-07-25",
      excerpt: "From simple ramps to complex landscapes, explore the history of surf map design.",
      author: "MapMaker101",
      readTime: "8 min read",
    },
    {
      title: "Community Spotlight: SurfMaster2000",
      date: "2024-07-22",
      excerpt: "An interview with one of our top players and their journey to the top.",
      author: "CommunityManager",
      readTime: "6 min read",
    },
  ])

  const [showCookieBanner, setShowCookieBanner] = useState(true)

  const handleNewsReaction = (index: number, reactionIndex: number) => {
    const newNewsItems = [...newsItems]
    newNewsItems[index].reactions[reactionIndex].count += 1
    setNewsItems(newNewsItems)
  }

  const handleChangelogReaction = (index: number, reactionIndex: number) => {
    const newChangelog = [...changelog]
    newChangelog[index].reactions[reactionIndex].count += 1
    setChangelog(newChangelog)
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />

      <AlertBanner 
        title="New Challenge Available!" 
        description="The 'Surf Master' event has started. Complete 10 maps in 24 hours to earn exclusive rewards!" 
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <UserProfileCard />
            <LiveFeedCard recentEvents={recentEvents} />
            <RecentPostsCard recentPosts={recentPosts} />
            <NewsCard newsItems={newsItems} onReact={handleNewsReaction} />
            <ChangelogCard changelog={changelog} onReact={handleChangelogReaction} />
          </div>

          <div className="space-y-8">
            <QuickActionsCard />
            <UserStatsCard />
            <ServerStatusCard />
            <BlogPostsCard blogPosts={blogPosts} />
          </div>
        </div>
      </main>
      <Footer />

      {showCookieBanner && (
        <CookieBanner 
          onAccept={() => setShowCookieBanner(false)} 
          onReject={() => setShowCookieBanner(false)} 
        />
      )}
    </div>
  )
}
