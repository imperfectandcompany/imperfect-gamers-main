import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Achievement {
  icon: string;
  title: string;
  description: string;
  date: string;
}

interface User {
    userName?: string;
    email?: string;
    avatarUrl: string;
    isSteamLinked: boolean;
    hasServerData: boolean;
    surfMapsCompleted: number;
    totalPlaytime: string;
    totalMuteTime: string;
    totalBans: number;
    rank: number;
    rankPercentage: string;
    achievements: Achievement[];
    rating: number;
    pointsToNextRank: number;
    progressToNextRank: number;
    totalJumps: number;
    avgSpeed: number;
    favoriteMap: string;
    xp: number;
    maxXp: number;
    level: number;
    isDiscordLinked: boolean;
    hasCompletedOnboarding: boolean;
  }
  

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: Partial<User>) => void;
  logout: () => void;
  completeOnboarding: () => void;
  linkSteam: () => void;
  linkDiscord: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: Partial<User>) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
      hasServerData: userData.hasServerData ?? false, // Assume no server data until verified
      hasCompletedOnboarding: userData.hasCompletedOnboarding ?? false,
      isSteamLinked: userData.isSteamLinked ?? false,
      isDiscordLinked: userData.isDiscordLinked ?? false,
      achievements: userData.achievements ?? [],
      avatarUrl: userData.avatarUrl ?? '',
      surfMapsCompleted: userData.surfMapsCompleted ?? 0,
      totalPlaytime: userData.totalPlaytime ?? '0h',
      totalMuteTime: userData.totalMuteTime ?? '0h',
      totalBans: userData.totalBans ?? 0,
      rank: userData.rank ?? 0,
      rankPercentage: userData.rankPercentage ?? '0%',
      rating: userData.rating ?? 0,
      pointsToNextRank: userData.pointsToNextRank ?? 0,
      progressToNextRank: userData.progressToNextRank ?? 0,
      totalJumps: userData.totalJumps ?? 0,
      avgSpeed: userData.avgSpeed ?? 0,
      favoriteMap: userData.favoriteMap ?? 'None',
      xp: userData.xp ?? 0,
      maxXp: userData.maxXp ?? 100,
      level: userData.level ?? 1,
      email: userData.email ?? '',
    }) as User);
    setIsLoggedIn(true);
  };
  

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const completeOnboarding = () => {
    setUser((prevUser) =>
      prevUser ? { ...prevUser, hasCompletedOnboarding: true } : prevUser
    );
  };

  const linkSteam = () => {
    setUser((prevUser) =>
      prevUser ? { ...prevUser, isSteamLinked: true } : prevUser
    );
  };

  const linkDiscord = () => {
    setUser((prevUser) =>
      prevUser ? { ...prevUser, isDiscordLinked: true } : prevUser
    );
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        completeOnboarding,
        linkSteam,
        linkDiscord,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
