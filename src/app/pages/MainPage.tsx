// components/MainPage.tsx

import React, { useState } from "react";
import MainNavbar from "@components/Navbar/MainNavbar";
import Header from "@components/Header/Header";
import UserProfileCard from "@components/Cards/UserProfileCard";
import LiveFeedCard from "@components/Cards/LiveFeedCard";
import RecentPostsCard from "@components/Cards/RecentPostsCard";
import NewsCard from "@components/Cards/NewsCard";
import ChangelogCard from "@components/Cards/ChangelogCard";
import QuickActionsCard from "@components/Cards/QuickActionsCard";
import UserStatsCard from "@components/Cards/UserStatsCard";
import ServerStatusCard from "@components/Cards/ServerStatusCard";
import BlogPostsCard from "@components/Cards/BlogPostsCard";
import Footer from "@components/Footer/Footer";
import CookieBanner from "@components/CookieBanner/CookieBanner";
import AlertBanner from "@components/AlertBanner/AlertBanner";
import { handleRestrictedAction } from "@utils/authUtils";
import Icons from "@components/Shared/Icons";
import CommunityFeedbackCard from "../components/Cards/CommunityFeedBackCard";
import AuthModal from "@components/Auth/AuthModal";
import { useAuth } from "@context/AuthContext";
import { motion } from "framer-motion";
import { useFeatureFlags } from "@context/FeatureFlagContext";
import { FeatureFlagKeys } from "@utils/featureFlags";
import { Toaster } from "sonner";

interface MainPageProps {
  fidelity: number;
  shouldApplyBlur: boolean;
}

export const MainPage: React.FC<MainPageProps> = ({
  fidelity,
  shouldApplyBlur,
}) => {
  const blur = Math.max(20 - fidelity / 5, 0);
  const opacity = fidelity / 100;
  const { isLoggedIn, user, unlinkSteam } = useAuth();

  const { isFeatureEnabled } = useFeatureFlags();

  const [recentEvents, setRecentEvents] = useState([
    {
      type: "join",
      user: "Player 1",
      details: "joined the server",
      timestamp: new Date(Date.now() - 5 * 60000),
      icon: <Icons.LogIn className="h-4 w-4" />,
      isModerator: true,
    },
    {
      type: "mute",
      user: "Player 2",
      details: "got muted for 10 minutes",
      timestamp: new Date(Date.now() - 15 * 60000),
      icon: <Icons.Ban className="h-4 w-4" />,
    },
    {
      type: "mapChange",
      details:
        "Map changed from surf_easy to surf_medium on the Beginner server",
      timestamp: new Date(Date.now() - 30 * 60000),
      icon: <Icons.Megaphone className="h-4 w-4" />,
    },
    {
      type: "subscribe",
      user: "Player 3",
      details: "subscribed to premium",
      timestamp: new Date(Date.now() - 60 * 60000),
      icon: <Icons.Gift className="h-4 w-4" />,
    },
    {
      type: "record",
      user: "Player 4",
      details: "beat the map record with a time of 1:23.45",
      timestamp: new Date(Date.now() - 90 * 60000),
      icon: <Icons.Trophy className="h-4 w-4" />,
    },
  ]);

  const [recentPosts, setRecentPosts] = useState([
    {
      title: "Need help with surf_skyworld",
      author: "NewSurfer123",
      thread: "Map Help",
      timestamp: new Date(Date.now() - 30 * 60000),
    },
    {
      title: "Awesome surf montage!",
      author: "ProSurfer99",
      thread: "Media Showcase",
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
    },
    {
      title: "Tips for improving air strafes?",
      author: "AirStrafe101",
      thread: "Tutorials",
      timestamp: new Date(Date.now() - 4 * 60 * 60000),
    },
  ]);

  const [changelog, setChangelog] = useState([
    {
      version: "1.2.3",
      date: "2024-08-01",
      changes: [
        "Added new surf maps",
        "Fixed bug in leaderboard system",
        "Improved server performance",
      ],
      reactions: [
        { emoji: "👍", count: 15 },
        { emoji: "❤️", count: 7 },
        { emoji: "🎉", count: 3 },
        { emoji: "🔥", count: 1 },
      ],
    },
    {
      version: "1.2.2",
      date: "2024-07-15",
      changes: [
        "Introduced VIP membership",
        "Updated UI for better user experience",
        "Added new community events",
      ],
      reactions: [
        { emoji: "👍", count: 22 },
        { emoji: "❤️", count: 11 },
        { emoji: "🎉", count: 5 },
        { emoji: "🔥", count: 2 },
      ],
    },
  ]);

  const [newsItems, setNewsItems] = useState([
    {
      title: "Summer Surf Championship Announced",
      date: "2024-07-30",
      content: "Get ready for the biggest surf event of the year!",
      reactions: [
        { emoji: "👍", count: 45 },
        { emoji: "❤️", count: 23 },
        { emoji: "🎉", count: 7 },
        { emoji: "🔥", count: 3 },
      ],
    },
    {
      title: "New Map Pack Release",
      date: "2024-07-27",
      content: "Five new challenging maps added to the rotation.",
      reactions: [
        { emoji: "👍", count: 38 },
        { emoji: "❤️", count: 19 },
        { emoji: "🎉", count: 4 },
        { emoji: "🔥", count: 2 },
      ],
    },
  ]);

  const [blogPosts, setBlogPosts] = useState([
    {
      title: "Mastering the Art of Surfing",
      date: "2024-07-28",
      excerpt:
        "Learn the techniques that pro surfers use to dominate the leaderboards.",
      author: "SurfMaster2000",
      readTime: "5 min read",
    },
    {
      title: "The Evolution of Surf Maps",
      date: "2024-07-25",
      excerpt:
        "From simple ramps to complex landscapes, explore the history of surf map design.",
      author: "MapMaker101",
      readTime: "8 min read",
    },
    {
      title: "Community Spotlight: SurfMaster2000",
      date: "2024-07-22",
      excerpt:
        "An interview with one of our top players and their journey to the top.",
      author: "CommunityManager",
      readTime: "6 min read",
    },
  ]);

  const canReactToItems =
    isLoggedIn &&
    user?.hasCompletedOnboarding &&
    user?.isSteamLinked &&
    user?.hasServerData;

  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authContextMessage, setAuthContextMessage] = useState<string>("");

  const [cookieAccepted, setCookieAccepted] = useState(false);

  // Handlers for CookieBanner
  const handleAcceptCookies = () => {
    setCookieAccepted(true);
    // TODO: Implement additional logic, such as setting cookies or making API calls
    console.log("Cookies accepted");
    setShowCookieBanner(false);
  };

  const handleRejectCookies = () => {
    setCookieAccepted(false);
    // TODO: Implement additional logic, such as disabling tracking
    console.log("Cookies rejected");
    setShowCookieBanner(false);
  };

  const showAuthModal = (message?: string) => {
    setAuthContextMessage(message || "");
    setAuthModalOpen(true);
  };

  const handleRestrictedInteraction = (
    requiredState: "login" | "onboard" | "steam"
  ) => {
    const { success, message } = handleRestrictedAction(
      isLoggedIn,
      user,
      requiredState
    );
    if (!success) {
      showAuthModal(message);
      return false;
    }
    return true;
  };

  const handleNewsReaction = (index: number, reactionIndex: number) => {
    if (!handleRestrictedInteraction("onboard")) return;

    // Continue if authorized
    const newNewsItems = [...newsItems];
    newNewsItems[index].reactions[reactionIndex].count += 1;
    setNewsItems(newNewsItems);
  };

  const handleChangelogReaction = (index: number, reactionIndex: number) => {
    if (!handleRestrictedInteraction("steam")) return;

    // Continue if authorized
    const newChangelog = [...changelog];
    newChangelog[index].reactions[reactionIndex].count += 1;
    setChangelog(newChangelog);
  };

  const handleLeaveReview = () => {
    if (!handleRestrictedInteraction("onboard")) return;

    console.log("Leave a review action triggered");
  };

  const handleMakeSuggestion = () => {
    if (!handleRestrictedInteraction("onboard")) return;

    console.log("Make a suggestion action triggered");
  };

  const reactionEmojis = [
    "👍",
    "❤️",
    "😂",
    "😮",
    "😢",
    "😡",
    "🎉",
    "🤔",
    "👀",
    "🔥",
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen"
      >
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          contextMessage={authContextMessage}
        />
        <MainNavbar />
        <Header
          isLoggedIn={isLoggedIn}
          isSteamLinked={user?.isSteamLinked ?? false}
          steamId={String(user?.steamId ?? 0)}
          hasCompletedOnboarding={user?.hasCompletedOnboarding}
          onOpenAuthModal={showAuthModal}
          unlinkSteam={unlinkSteam}
          fidelity={fidelity}
          shouldApplyBlur={true}
        />
        <div className="hidden">
          <AlertBanner
            title="New Challenge Available!"
            description="The 'Surf Master' event has started. Complete 10 maps in 24 hours to earn exclusive rewards!"
          />
        </div>
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {isFeatureEnabled(
                FeatureFlagKeys.ENABLE_MAINPAGE_USER_PROFILE
              ) && (
                <motion.div style={{ filter: `blur(${blur}px)`, opacity }}>
                  <UserProfileCard
                    isLoggedIn={isLoggedIn}
                    userName={user?.profile?.username}
                    avatarUrl={
                      user?.profile?.avatar
                        ? `https://cdn.postogon.com/assets/img/profile_pictures/${user.profile.avatar}`
                        : undefined
                    }
                    isVerified={user?.verified}
                    isVip={user?.gameStats?.isVip}
                    email={user?.email}
                    timesConnected={user?.gameStats?.timesConnected}
                    lastConnected={user?.gameStats?.lastConnected}
                    isSteamLinked={user?.isSteamLinked ?? false}
                    hasServerData={user?.hasServerData ?? false}
                  />
                </motion.div>
              )}

              {isFeatureEnabled(FeatureFlagKeys.ENABLE_MAINPAGE_LIVE_FEED) && (
                <LiveFeedCard recentEvents={recentEvents} />
              )}

              {isFeatureEnabled(
                FeatureFlagKeys.ENABLE_MAINPAGE_RECENT_POSTS
              ) && <RecentPostsCard recentPosts={recentPosts} />}

              {isFeatureEnabled(FeatureFlagKeys.ENABLE_MAINPAGE_NEWS) && (
                <motion.div style={{ filter: `blur(${blur}px)`, opacity }}>
                  <NewsCard
                    newsItems={newsItems}
                    onReact={handleNewsReaction}
                    reactionEmojis={reactionEmojis}
                  />
                </motion.div>
              )}

              {isFeatureEnabled(FeatureFlagKeys.ENABLE_MAINPAGE_CHANGELOG) && (
                <ChangelogCard
                  changelog={changelog}
                  onReact={handleChangelogReaction}
                  reactionEmojis={reactionEmojis}
                />
              )}
            </div>
            <div className="space-y-8">
              {isFeatureEnabled(
                FeatureFlagKeys.ENABLE_MAINPAGE_QUICK_ACTIONS
              ) && <QuickActionsCard />}

              {isFeatureEnabled(FeatureFlagKeys.ENABLE_MAINPAGE_USER_STATS) && (
                <motion.div style={{ filter: `blur(${blur}px)`, opacity }}>
                  <UserStatsCard
                    isLoggedIn={isLoggedIn}
                    isSteamLinked={user?.isSteamLinked ?? false}
                    hasCompletedOnboarding={
                      user?.hasCompletedOnboarding ?? false
                    }
                    hasServerData={user?.hasServerData ?? false}
                    gameStats={user?.gameStats ?? null}
                  />
                </motion.div>
              )}

              {isFeatureEnabled(FeatureFlagKeys.ENABLE_MAINPAGE_BLOG_POSTS) && (
                <BlogPostsCard blogPosts={blogPosts} />
              )}

              {isFeatureEnabled(
                FeatureFlagKeys.ENABLE_MAINPAGE_SERVER_STATUS
              ) && <ServerStatusCard />}

              {isFeatureEnabled(
                FeatureFlagKeys.ENABLE_MAINPAGE_COMMUNITY_FEEDBACK
              ) && (
                <CommunityFeedbackCard
                  onLeaveReview={handleLeaveReview}
                  onMakeSuggestion={handleMakeSuggestion}
                />
              )}
            </div>
          </div>
        </main>
        <Footer />
        {/* Conditionally render CookieBanner if cookies are not accepted */}
        {isFeatureEnabled(FeatureFlagKeys.ENABLE_COOKIEBANNER) &&
          showCookieBanner && (
            <CookieBanner
              onAccept={handleAcceptCookies}
              onReject={handleRejectCookies}
            />
          )}
      </motion.div>
    </>
  );
};

export default MainPage;
