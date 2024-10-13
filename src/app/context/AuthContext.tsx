// AuthContext.tsx

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import apiClient from '@api/apiClient';

// Achievement Interface
interface Achievement {
  icon: string;
  title: string;
  description: string;
  date: string;
}

// User Interface
export interface User {
  uid: number;
  email: string;
  userName?: string;
  avatarUrl?: string;
  isSteamLinked: boolean;
  steamId?: string | null;
  hasServerData: boolean;
  surfMapsCompleted?: number;
  totalPlaytime?: string;
  totalMuteTime?: string;
  totalBans?: number;
  rank?: number;
  rankPercentage?: string;
  achievements?: Achievement[];
  rating?: number;
  pointsToNextRank?: number;
  progressToNextRank?: number;
  totalJumps?: number;
  avgSpeed?: number;
  favoriteMap?: string;
  xp?: number;
  maxXp?: number;
  level?: number;
  isDiscordLinked: boolean;
  hasCompletedOnboarding: boolean;
}

// Auth Context Interface
interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  currentView: string;
  errorMessage: string;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
  linkSteam: () => void;
  linkDiscord: () => void;
  setCurrentView: (view: string) => void;
  setErrorMessage: (message: string) => void;
  changeUsername: (newUsername: string) => Promise<void>;
  checkUsernameExistence: (username: string) => Promise<boolean>;
}

// Interfaces for API responses
interface LoginSuccessResponse {
  status: 'success';
  token: string;
  uid: number;
  email: string;
}

interface LoginErrorResponse {
  status: 'error';
  message: string;
}

type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

interface VerifyTokenResponse {
  status: 'success' | 'error';
  valid?: boolean;
  message?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component that wraps the application
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State variables
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('welcome');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Load token from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      verifyToken(storedToken);
    }
  }, []);

  // Verifies the token and updates the authentication state
  const verifyToken = async (token: string) => {
    try {
      const response = await apiClient.get<VerifyTokenResponse>('/auth/verifyToken', {
        params: { token },
      });

      if (response.data.status === 'success' && response.data.valid) {
        setIsLoggedIn(true);
        // Fetch user data
        await fetchUserData();
        // Optionally, set uid if available from localStorage
        const uidString = localStorage.getItem('uid');
        if (uidString) {
          const uid = parseInt(uidString, 10);
          setUser((prevUser) =>
            prevUser ? { ...prevUser, uid } : prevUser
          );
        }
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      handleLogout();
    }
  };

  // Fetches user data, including onboarding status and Steam verification
  const fetchUserData = async () => {
    try {
      const response = await apiClient.get('/user/onboarded');

      if (response.data.status === 'success') {
        const { onboarded, username } = response.data;

        setUser((prevUser) =>
          prevUser
            ? {
                ...prevUser,
                hasCompletedOnboarding: onboarded,
                userName: username || prevUser.userName || '',
              }
            : prevUser
        );

        setCurrentView(onboarded ? 'welcome' : 'setUsername');

        // Verify if Steam is linked
        await verifySteamAccount();
      } else {
        console.error('Failed to fetch user onboarding status:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Verifies if the Steam account is linked
  const verifySteamAccount = async () => {
    try {
      const response = await apiClient.post('/user/verifySteam');

      if (response.data.status === 'success') {
        const { hasSteam, steamId } = response.data;
        setUser((prevUser) =>
          prevUser
            ? {
                ...prevUser,
                isSteamLinked: hasSteam,
                steamId: steamId || null,
              }
            : prevUser
        );
        if (hasSteam) {
          // Fetch server data if Steam is linked
          await fetchServerData();
        }
      } else {
        console.error('Failed to verify Steam account:', response.data.message);
        setUser((prevUser) =>
          prevUser
            ? {
                ...prevUser,
                isSteamLinked: false,
                steamId: null,
              }
            : prevUser
        );
      }
    } catch (error) {
      console.error('Error verifying Steam account:', error);
      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              isSteamLinked: false,
              steamId: null,
            }
          : prevUser
      );
    }
  };

  // Handles user login
  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth', {
        username: email,
        password,
      });

      if (response.data.status === 'success') {
        const { token, uid } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('uid', uid.toString());

        setUser({
          uid,
          email,
          hasCompletedOnboarding: false,
          isSteamLinked: false,
          hasServerData: false,
          isDiscordLinked: false,
        });

        setIsLoggedIn(true);
        await fetchUserData();
        setErrorMessage('');
      } else {
        console.error('Login failed:', response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  // Handles user registration
  const register = async (email: string, password: string): Promise<void> => {
    try {
      const response = await apiClient.post('/register', {
        email,
        password,
      });

      if (response.data.status === 'success') {
        // Registration successful
        return;
      } else {
        console.error('Registration failed:', response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('Error during registration:', error);
      throw new Error(error.response?.data?.message || 'An unexpected error occurred during registration.');
    }
  };

  // Changes the username during onboarding
  const changeUsername = async (newUsername: string) => {
    try {
      const response = await apiClient.post('/user/changeusername', {
        username: newUsername,
      });

      if (response.data.status === 'success') {
        setUser((prevUser) =>
          prevUser
            ? {
                ...prevUser,
                userName: newUsername,
                hasCompletedOnboarding: true,
              }
            : prevUser
        );
        setCurrentView('welcome');
      } else {
        setErrorMessage(response.data.error || 'An error occurred while changing username.');
      }
    } catch (error) {
      console.error('Error changing username:', error);
      setErrorMessage('An unexpected error occurred.');
    }
  };

  // Checks if a username already exists
  const checkUsernameExistence = async (username: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/user/checkUsernameExistence', {
        username,
      });

      if (response.data.status === 'success') {
        return response.data.exists;
      } else {
        console.error('Failed to check username existence:', response.data.error);
        return false;
      }
    } catch (error) {
      console.error('Error checking username existence:', error);
      return false;
    }
  };

  // Fetches server data after linking Steam
  const fetchServerData = async () => {
    if (!user || !user.steamId) return;
    try {
      const response = await apiClient.get('/user/serverData');

      if (response.data.status === 'success') {
        const serverData = response.data.data;
        setUser((prevUser) =>
          prevUser
            ? {
                ...prevUser,
                hasServerData: true,
                totalBans: serverData.totalBans,
                favoriteMap: serverData.favoriteMap,
                // Update other server-related properties here
              }
            : prevUser
        );
      } else {
        console.error('Failed to fetch server data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching server data:', error);
    }
  };

  // Handles linking the Steam account
  const linkSteam = async () => {
    // TODO: Implement actual Steam linking logic
    setUser((prevUser) =>
      prevUser
        ? {
            ...prevUser,
            isSteamLinked: true,
            steamId: '7656119815919597', // Mock Steam ID
            hasServerData: false,
          }
        : prevUser
    );
    await fetchServerData();
  };

  // Handles linking the Discord account
  const linkDiscord = () => {
    // TODO: Implement actual Discord linking logic
    setUser((prevUser) =>
      prevUser
        ? {
            ...prevUser,
            isDiscordLinked: true,
          }
        : prevUser
    );
  };

  // Logs the user out
  const logout = () => {
    handleLogout();
    // TODO: Call logout endpoint to invalidate token on the server
  };

  // Helper function to handle logout
  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView('welcome');
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
  };

  // Marks the onboarding process as complete
  const completeOnboarding = () => {
    setUser((prevUser) =>
      prevUser
        ? {
            ...prevUser,
            hasCompletedOnboarding: true,
          }
        : prevUser
    );
    setCurrentView('welcome');
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        currentView,
        errorMessage,
        login,
        register,
        logout,
        completeOnboarding,
        linkSteam,
        linkDiscord,
        setCurrentView,
        setErrorMessage,
        checkUsernameExistence,
        changeUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
