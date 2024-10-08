// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Achievement {
  icon: string;
  title: string;
  description: string;
  date: string;
}

interface User {
  userName: string;
  avatarUrl: string;
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
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
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
