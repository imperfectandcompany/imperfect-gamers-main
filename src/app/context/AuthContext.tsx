// context/AuthContext.tsx

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import apiClient from "@api/apiClient";
import { UserTest } from "../interfaces/User";
import { PlayerRecord, PlayerStageTime } from "../interfaces/server2";

// Achievement Interface
interface Achievement {
  icon: string;
  title: string;
  description: string;
  date: string;
}

// Old User Interface (currently using so things dont break but tryna get fetchuserdata to get us data to test hten will update )
export interface User {
  uid: number;
  email: string;
  userName: string;
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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  currentView: string;
  errorMessage: string;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getEmail: () => string | null;
  completeOnboarding: () => void;
  linkSteam: (steamId: string) => void;
  unlinkSteam: () => Promise<void>;
  linkDiscord: () => void;
  setCurrentView: (view: string) => void;
  setErrorMessage: (message: string) => void;
  changeUsername: (newUsername: string) => Promise<void>;
  checkUsernameExistence: (username: string) => Promise<boolean>;
  setIsVerifying: (value: boolean) => void;
  isVerifying: boolean;
}

// Interfaces for API responses
interface LoginSuccessResponse {
  status: "success";
  token: string;
  uid: number;
  email: string;
}

interface LoginErrorResponse {
  status: "error";
  message: string;
}

type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

interface VerifyTokenResponse {
  status: "success" | "error";
  uid?: number;
  message?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component that wraps the application
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // State variables
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>("welcome");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Load token from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      verifyToken(storedToken);
    }
  }, []);

  const getEmail = (): string | null => {
    return user ? user.email : null;
  };

  // Verifies the token and updates the authentication state
  const verifyToken = async (token: string) => {
    setIsVerifying(true); // Start loading
    try {
      const response = await apiClient.get<VerifyTokenResponse>(
        "/auth/verifyToken",
        {
          params: { token },
        }
      );

      if (response.data.status === "success" && response.data.uid) {
        const uid = response.data.uid;
        setIsLoggedIn(true);

        // Set initial user state
        setUser({
          uid,
          email: "", // Will be fetched in fetchUserData
          userName: "",
          hasCompletedOnboarding: false,
          isSteamLinked: false,
          hasServerData: false,
          isDiscordLinked: false,
        });

        // Fetch user data
        await fetchUserData(754);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      handleLogout();
    } finally {
      setIsVerifying(false); // End loading
    }
  };

  // Unlink Steam method
  const unlinkSteam = async () => {
    if (!user || !user.isSteamLinked) {
      throw new Error("User is not linked to Steam.");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found.");
    }
    try {
      const response = await apiClient.post("/user/unlinkSteam", {
        params: { token },
      });
      if (response.data.status === "success") {
        setUser((prevUser) =>
          prevUser
            ? {
                ...prevUser,
                isSteamLinked: false,
                steamId: null,
                // TODO: Reset other Steam-dependent properties if any
              }
            : prevUser
        );
      }
    } catch (error) {
      console.error("Failed to unlink Steam:", error);
      throw error;
    }
  };

  const fetchUserData = async (uid: number) => {
    try {
      const response = await fetch(`/api/user/${uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      // Transform data as needed to fit your User interface
      const aggregatedUser: UserTest = {
        server1: {
          ...data,
          id: data.id,
          email: data.email,
          status: data.status,
          admin: data.admin,
          verified: false,
          createdAt: data.createdAt
        },
        playerStats: data,
        playerRecords: data as PlayerRecord[],
        playerStageTimes: data as PlayerStageTime[],
        hasServerData: !!data,
      };
      setIsLoggedIn(true);
      console.log(aggregatedUser);
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // // Fetches user data, including onboarding status and Steam verification
  // const fetchUserData = async (uid: number) => {
  //   try {
  //     // Fetch Server1 Data
  //     const [userRows] = await poolServer1.execute<RowDataPacket[]>(
  //       'SELECT * FROM users WHERE id = ?',
  //       [uid]
  //     );

  //     if (!userRows.length) throw new Error('User not found');

  //     const server1User = userRows[0];

  //     // Fetch Profile
  //     const [profileRows] = await poolServer1.execute<RowDataPacket[]>(
  //       'SELECT * FROM profiles WHERE user_id = ?',
  //       [uid]
  //     );
  //     const profile = profileRows[0] as Profile;
  //     // Fetch Server2 Data
  //     const [playerStatsRows] = await poolServer2.execute<RowDataPacket[]>(
  //       'SELECT * FROM activity_tracking.PlayerStats WHERE SteamID = (SELECT steam_id_64 FROM profiles WHERE user_id = ?)',
  //       [uid]
  //     );
  //     const playerStats = playerStatsRows[0] as PlayerStats;

  //     const [playerRecordRows] = await poolServer2.execute<RowDataPacket[]>(
  //       'SELECT * FROM activity_tracking.PlayerRecords WHERE SteamID = (SELECT steam_id_64 FROM profiles WHERE user_id = ?)',
  //       [uid]
  //     );
  //     const playerRecords = playerRecordRows as RowDataPacket[];

  //     const [playerStageTimeRows] = await poolServer2.execute<RowDataPacket[]>(
  //       'SELECT * FROM activity_tracking.PlayerStageTimes WHERE SteamID = (SELECT steam_id_64 FROM profiles WHERE user_id = ?)',
  //       [uid]
  //     );

  //     // Aggregate Data
  //     const aggregatedUser: UserTest = {
  //       server1: {
  //         ...server1User,
  //         id: server1User.id,
  //         email: server1User.email,
  //         status: server1User.status,
  //         admin: server1User.admin,
  //         verified: false,
  //         createdAt: server1User.createdAt
  //       },
  //       playerStats: playerStats,
  //       playerRecords: playerRecords as PlayerRecord[],
  //       playerStageTimes: playerStageTimeRows as PlayerStageTime[],
  //       hasServerData: !!playerStats,
  //     };
      

  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //     setIsLoggedIn(false);
  //     setUser(null);
  //   }
  // };

  // Verifies if the Steam account is linked
  const verifySteamAccount = async () => {
    try {
      const response = await apiClient.post("/user/verifySteam");

      if (response.data.status === "success") {
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
          await fetchServerData(steamId);
        }
      } else {
        console.error("Failed to verify Steam account:", response.data.message);
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
      console.error("Error verifying Steam account:", error);
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
  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    try {
      const response = await apiClient.post<LoginResponse>("/auth", {
        username: email,
        password,
      });

      if (response.data.status === "success") {
        const { token, uid } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("uid", uid.toString());

        setUser({
          uid,
          email,
          userName: "",
          hasCompletedOnboarding: false,
          isSteamLinked: false,
          hasServerData: false,
          isDiscordLinked: false,
        });

        setIsLoggedIn(true);
        const updatedUser = await fetchLoginData(uid);

        return updatedUser;
      } else {
        console.error("Login failed:", response.data.message);
        throw new Error(response.data.message || "Login failed.");
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      let errorMessage = "An unexpected error occurred.";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password.";
        } else {
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  };

      // Fetches user data, including onboarding status and Steam verification
      const fetchLoginData = async (uid: number): Promise<User | null> => {
        try {
          const response = await apiClient.get("/user/onboarded");
    
          if (response.data.status === "success") {
            const { onboarded, username, email } = response.data;
    
            const updatedUser: User = {
              uid: uid,
              email: email || "",
              userName: username || "",
              hasCompletedOnboarding: onboarded,
              avatarUrl: user?.avatarUrl,
              isSteamLinked: user?.isSteamLinked || false,
              steamId: user?.steamId || null,
              hasServerData: user?.hasServerData || false,
              isDiscordLinked: user?.isDiscordLinked || false,
              // Initialize other properties if needed
            };
    
            setUser(updatedUser);
    
            setCurrentView(onboarded ? "welcome" : "setUsername");
    
            // Verify if Steam is linked
            await verifySteamAccount();

            await fetchUserData(Number(uid));

            return updatedUser;
          } else {
            console.error(
              "Failed to fetch user onboarding status:",
              response.data.message
            );
            return null;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          return null;
        }
      };

  // Handles user registration
  const register = async (email: string, password: string): Promise<void> => {
    try {
      const response = await apiClient.post("/register", {
        email,
        password,
      });

      if (response.data.status === "success") {
        // Registration successful
        return;
      } else {
        console.error("Registration failed:", response.data.message);
        throw new Error(response.data.message || "Registration failed.");
      }
    } catch (error: any) {
      console.error("Error during registration:", error);
      let errorMessage = "An unexpected error occurred during registration.";
      if (error.response) {
        errorMessage =
          error.response.data.message ||
          "An unexpected error occurred during registration.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  };

  // Changes the username during onboarding
  const changeUsername = async (newUsername: string) => {
    try {
      const response = await apiClient.post("/user/changeusername", {
        username: newUsername,
      });

      if (response.data.status === "success") {
        setUser((prevUser) =>
          prevUser
            ? {
                ...prevUser,
                userName: newUsername,
                hasCompletedOnboarding: true,
              }
            : prevUser
        );
        setCurrentView("welcome");
      } else {
        console.error("Failed to change username:", response.data.message);
        throw new Error(
          response.data.message || "An error occurred while changing username."
        );
      }
    } catch (error: any) {
      console.error("Error changing username:", error);
      let errorMessage = "An unexpected error occurred.";
      if (error.response) {
        errorMessage =
          error.response.data.message || "An unexpected error occurred.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  };

  // Checks if a username already exists
  const checkUsernameExistence = async (username: string): Promise<boolean> => {
    try {
      const response = await apiClient.post("/user/checkUsernameExistence", {
        username,
      });

      if (response.data.status === "success") {
        return response.data.exists;
      } else {
        console.error(
          "Failed to check username existence:",
          response.data.error
        );
        return false;
      }
    } catch (error) {
      console.error("Error checking username existence:", error);
      return false;
    }
  };

  // Fetches server data after linking Steam
  const fetchServerData = async (steamId: string) => {
    if (!user || !steamId) return;
    try {
      const response = await apiClient.get(`/user/serverData/${steamId}`);

      if (response.data.status === "success") {
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
        console.error("Failed to fetch server data:", response.data.message);
        setUser((prevUser) =>
          prevUser
            ? {
                ...prevUser,
                hasServerData: false,
              }
            : prevUser
        );
      }
    } catch (error) {
      console.error("Error fetching server data:", error);
      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              hasServerData: false,
            }
          : prevUser
      );
    }
  };

  // Handles linking the Steam account
  const linkSteam = async (steamId: string) => {
    setUser((prevUser) =>
      prevUser
        ? {
            ...prevUser,
            isSteamLinked: true,
            steamId: steamId,
          }
        : prevUser
    );
    // Fetch server data if needed
    await fetchServerData(steamId);
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
    setCurrentView("welcome");
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
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
    setCurrentView("welcome");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        setUser,
        currentView,
        errorMessage,
        login,
        register,
        logout,
        getEmail,
        completeOnboarding,
        linkSteam,
        unlinkSteam,
        linkDiscord,
        setCurrentView,
        setErrorMessage,
        checkUsernameExistence,
        changeUsername,
        isVerifying,
        setIsVerifying,
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
