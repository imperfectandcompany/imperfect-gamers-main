import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface Achievement {
  icon: string;
  title: string;
  description: string;
  date: string;
}

export interface User {
  userName?: string;
  email?: string;
  avatarUrl: string;
  isSteamLinked: boolean;
  steamId?: string;
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
  currentView: string;
  errorMessage: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
  linkSteam: () => void;
  linkDiscord: () => void;
  setCurrentView: (view: string) => void;
  setErrorMessage: (message: string) => void;
}

interface SuccessResponse {
  status: 'success';
  token: string;
  uid: number;
  email: string;
}

interface ErrorResponse {
  status: 'error';
  message: string;
}

type LoginResponse = SuccessResponse | ErrorResponse;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('welcome');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const apiBase = 'https://api.imperfectgamers.org';

  // Load token from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Optionally fetch user data
      fetchUserData(storedToken);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get(`${apiBase}/user/onboarded`, {
        headers: {
          authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 'success') {
        const { onboarded, username } = response.data;
        setUser((prevUser) =>
          prevUser
            ? {
                ...prevUser,
                userName: username || prevUser.userName,
                hasCompletedOnboarding: onboarded,
              }
            : prevUser
        );

        if (!onboarded) {
          setCurrentView('setUsername');
        } else {
          setCurrentView('welcome');
        }
      } else {
        console.error('Failed to fetch user onboarding status:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  


  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<LoginResponse>(`${apiBase}/auth`, {
        username: email,
        password: password,
      });
  
      if (response.data.status === 'success') {
        const { token: token, uid } = response.data;
        setToken(token);
        localStorage.setItem('token', token);
  

        // Set user data with mocked values
        setUser({
          userName: email.split('@')[0], // Example username derived from email
          email: email,
          avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSyq7MRokEaKKx1eKBxOp15WH2JhzyutGO9w&s',
          isSteamLinked: false,
          steamId: undefined,
          hasServerData: false,
          surfMapsCompleted: 0,
          totalPlaytime: '0h',
          totalMuteTime: '0h',
          totalBans: 0,
          rank: 0,
          rankPercentage: '0%',
          achievements: [],
          rating: 0,
          pointsToNextRank: 0,
          progressToNextRank: 0,
          totalJumps: 0,
          avgSpeed: 0,
          favoriteMap: 'None',
          xp: 0,
          maxXp: 100,
          level: 1,
          isDiscordLinked: false,
          hasCompletedOnboarding: false, // Assume not completed until verified
        });

        setIsLoggedIn(true);
        setCurrentView('setUsername');
        setErrorMessage(''); // Clear any previous error message
      } else if (response.data.status === 'error') {
        console.error('Login failed:', response.data.message);
        setErrorMessage(response.data.message); // Set the error message from the API
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An unexpected error occurred.'); // Set a generic error message
    }
  };

  // const login = (userData: Partial<User>) => {
    
  //   setUser((prevUser) => ({
  //     ...prevUser,
  //     ...userData,
  //     hasServerData: userData.hasServerData ?? false, // Assume no server data until verified
  //     hasCompletedOnboarding: userData.hasCompletedOnboarding ?? false,
  //     isSteamLinked: userData.isSteamLinked ?? false,
  //     isDiscordLinked: userData.isDiscordLinked ?? false,
  //     achievements: userData.achievements ?? [],
  //     avatarUrl: userData.avatarUrl ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSyq7MRokEaKKx1eKBxOp15WH2JhzyutGO9w&s',
  //     surfMapsCompleted: userData.surfMapsCompleted ?? 0,
  //     totalPlaytime: userData.totalPlaytime ?? '0h',
  //     totalMuteTime: userData.totalMuteTime ?? '0h',
  //     totalBans: userData.totalBans ?? 0,
  //     rank: userData.rank ?? 0,
  //     rankPercentage: userData.rankPercentage ?? '0%',
  //     rating: userData.rating ?? 0,
  //     pointsToNextRank: userData.pointsToNextRank ?? 0,
  //     progressToNextRank: userData.progressToNextRank ?? 0,
  //     totalJumps: userData.totalJumps ?? 0,
  //     avgSpeed: userData.avgSpeed ?? 0,
  //     favoriteMap: userData.favoriteMap ?? 'None',
  //     xp: userData.xp ?? 0,
  //     maxXp: userData.maxXp ?? 100,
  //     level: userData.level ?? 1,
  //     email: userData.email ?? '',
  //   }) as User);
  //   setIsLoggedIn(true);
  //   setCurrentView(userData.hasCompletedOnboarding ? 'welcome' : 'setUsername');
  // };


  // try {
  //   const response = await axios.post(`${apiBase}/auth`, {
  //     username: email,
  //     password: password,
  //   });

    // if (response.data.status === 'success') {
    //   const { email: userEmail, userToken: token, uid } = response.data.data;
    //   setUserToken(token);
    //   localStorage.setItem('userToken', token);
    // }

  // setUser((prevUser) => ({
  //   ...prevUser,
  //   ...userData,
  //   hasServerData: userData.hasServerData ?? false, // Assume no server data until verified
  //   hasCompletedOnboarding: userData.hasCompletedOnboarding ?? false,
  //   isSteamLinked: userData.isSteamLinked ?? false,
  //   isDiscordLinked: userData.isDiscordLinked ?? false,
  //   achievements: userData.achievements ?? [],
  //   avatarUrl: userData.avatarUrl ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSyq7MRokEaKKx1eKBxOp15WH2JhzyutGO9w&s',
  //   surfMapsCompleted: userData.surfMapsCompleted ?? 0,
  //   totalPlaytime: userData.totalPlaytime ?? '0h',
  //   totalMuteTime: userData.totalMuteTime ?? '0h',
  //   totalBans: userData.totalBans ?? 0,
  //   rank: userData.rank ?? 0,
  //   rankPercentage: userData.rankPercentage ?? '0%',
  //   rating: userData.rating ?? 0,
  //   pointsToNextRank: userData.pointsToNextRank ?? 0,
  //   progressToNextRank: userData.progressToNextRank ?? 0,
  //   totalJumps: userData.totalJumps ?? 0,
  //   avgSpeed: userData.avgSpeed ?? 0,
  //   favoriteMap: userData.favoriteMap ?? 'None',
  //   xp: userData.xp ?? 0,
  //   maxXp: userData.maxXp ?? 100,
  //   level: userData.level ?? 1,
  //   email: userData.email ?? '',
  // }) as User);
  // setIsLoggedIn(true);

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView('welcome');
  };

  const completeOnboarding = () => {
    setUser((prevUser) =>
      prevUser ? { ...prevUser, hasCompletedOnboarding: true } : prevUser
    );
    setCurrentView('welcome');
  };

  const linkSteam = () => {
    setUser((prevUser) =>
      prevUser
        ? {
            ...prevUser,
            isSteamLinked: true,
            steamId: '7656119815919597', // Set a mock Steam ID
            avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSyq7MRokEaKKx1eKBxOp15WH2JhzyutGO9w&s',
            hasServerData: true,
            // You can set othr mock data here
            surfMapsCompleted: 42,
            totalPlaytime: '123h',
            totalMuteTime: '0h',
            totalBans: 0,
            rank: 1,
            rankPercentage: '0.1',
            achievements: [
              {
                icon: "🏆",
                title: "Map Master",
                description: "Complete 100 maps",
                date: "2024-07-01",
              },
              {
                icon: "🔥",
                title: "Speed Demon",
                description: "Complete surf_mesa in under 20 seconds",
                date: "2024-07-15",
              },
              {
                icon: "💎",
                title: "Diamond Surfer",
                description: "Reach Diamond rank",
                date: "2024-07-20",
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Complete 10 maps in under an hour",
                date: "2024-07-25",
              },
              {
                icon: "🌟",
                title: "Community Star",
                description: "Help 50 new players",
                date: "2024-07-30",
              },
            ],
            rating: 2500,
            pointsToNextRank: 500,
            progressToNextRank: 80,
            totalJumps: 10000,
            avgSpeed: 350,
            favoriteMap: 'surf_kitsune',
            xp: 9000,
            maxXp: 10000,
            level: 10,
          }
        : prevUser
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
    currentView,
    errorMessage,
    login,
    logout,
    completeOnboarding,
    linkSteam,
    linkDiscord,
    setCurrentView,
    setErrorMessage,
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
