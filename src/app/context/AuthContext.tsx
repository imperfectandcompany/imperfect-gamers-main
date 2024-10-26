// context/AuthContext.tsx

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import apiClient from "@api/apiClient";
import {
  AdminData,
  BansData,
  GameStats,
  MutesData,
  ServersData,
} from "../interfaces/server2";
import {
  ActivityLog,
  CheckoutDetail,
  Device,
  DeviceUsed,
  LoginLog,
  LoginToken,
  Payment,
  Profile,
} from "../interfaces/server1";
import { UserDataResponse } from "../interfaces/UserDataResponse";

// User Interface
export interface User {
  id?: number;
  email?: string;
  status?: "online" | "away" | "offline" | "dnd";
  admin?: boolean;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  hasCompletedOnboarding?: boolean;
  profile?: Profile | null;
  hasServerData?: boolean;
  isSteamLinked?: boolean;
  steamId?: string | null;
  gameStats?: GameStats;
  activityLogs?: ActivityLog[];
  devices?: Device[];
  loginLogs?: LoginLog[];
  loginTokens?: LoginToken[];
  paymentsMade?: Payment[];
  paymentsReceived?: Payment[];
  checkoutDetails?: CheckoutDetail[];
  adminData?: AdminData;
  bansData?: BansData;
  mutesData?: MutesData;
  serversData?: ServersData;
  potentialAltAccounts?: string[];
  devicesUsed?: DeviceUsed[];
  recentActivity?: ActivityLog[];
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
}: {
  children: ReactNode;
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

  // Helper function to handle logout
  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView("welcome");
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
  };

  const getEmail = (): string | null => {
    return user && user.email !== undefined ? user.email : null;
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
        setIsLoggedIn(true);
        const id = response.data.uid;
        setUser({
          id: id,
          status: "online",
        });

        setIsLoggedIn(true);
        await fetchLoginData(id);
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

  const fetchUserData = async (
    uid: number
  ): Promise<UserDataResponse | null> => {
    try {
      const response = await fetch(`/api/user/754`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data: UserDataResponse = await response.json();

      return data;
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      setIsLoggedIn(false);
      setUser(null);
      return null;
    }
  };

  // Fetches server data after linking Steam
  const fetchServerData = async (uid: number) => {
    if (!uid) return;
    try {
      return await fetchUserData(uid);
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

  // Verifies if the Steam account is linked
  const verifySteamAccount = async (uid: number) => {
    try {
      const response = await apiClient.post("/user/verifySteam");

      if (response.data.status === "success") {
        if (uid) {
          const userData = await fetchServerData(uid);
          if (userData) {
            const updatedUser: User = {
              ...user,
              email: userData.user.email,
              hasCompletedOnboarding: true,
              isSteamLinked: true,
              steamId: userData.user.profile?.steam_id || null,
              hasServerData: true,
              profile: userData.user.profile
                ? {
                    ...userData.user.profile,
                    bio_short: userData.user.profile.bio_short,
                  }
                : null,
              gameStats:  {
                    steamId: userData.user.gameStats?.steamId ?? '',
                    playerName: userData.user.gameStats?.playerName ?? '',
                    lastConnected: userData.user.gameStats?.lastConnected ?? 0,
                    hideTimerHud: userData.user.gameStats?.hideTimerHud ?? false,
                    hideJs: userData.user.gameStats?.hideJs ?? false,
                    playerFov: userData.user.gameStats?.playerFov ?? 0,
                    hideKeys: userData.user.gameStats?.hideKeys ?? false,
                    soundsEnabled: userData.user.gameStats?.soundsEnabled ?? false,
                    isVip: userData.user.gameStats?.isVip ?? false,
                    bigGifId: userData.user.gameStats?.bigGifId ?? '',
                    globalPoints: userData.user.gameStats?.globalPoints ?? 0,
                    timesConnected: userData.user.gameStats?.timesConnected ?? 0,
                    mapsCompleted: userData.user.gameStats?.mapsCompleted ?? 0,
                    mapRecords: userData.user.gameStats?.mapRecords ?? {},
                    totalMaps: userData.user.gameStats?.totalMaps ?? 0,
                    completionRate: userData.user.gameStats?.completionRate ?? 'fw',
                  },
              activityLogs: userData.activity?.logs || [],
              devices: userData.activity?.devices || [],
              loginLogs: userData.activity?.loginLogs || [],
              loginTokens: userData.activity?.loginTokens || [],
              paymentsMade: userData.user.payments?.made || [],
              paymentsReceived: userData.user.payments?.received || [],
              checkoutDetails: userData.user.payments?.checkoutDetails || [],
              adminData: userData.adminData,
              bansData: userData.user.bans,
              mutesData: userData.user.mutes,
              serversData: userData.servers,
              potentialAltAccounts: userData.potentialAltAccounts || [],
              devicesUsed: userData.devicesUsed || [],
              recentActivity: userData.recentActivity || [],
              status: userData.user.status as unknown as
                | "online"
                | "away"
                | "offline"
                | "dnd"
                | undefined,
            };
            setUser(updatedUser);
          } else {
            const { steamId } = response.data;

            const updatedUser: User = {
              ...user,
              hasCompletedOnboarding: true,
              isSteamLinked: true,
              steamId: steamId || null,
              id: uid,
            };

            setUser(updatedUser);
            // setUser((prevUser) =>
            //   prevUser
            //     ? {
            //         ...prevUser,
            //         isSteamLinked: true,
            //         steamId: steamId || null,
            //       }
            //     : prevUser
            // );
          }
        } else {
          console.error("User ID not available");
        }
      } else {
        console.error("Failed to verify Steam account:", response.data.error);
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
          id: uid,
          email,
          status: "online",
        });

        setIsLoggedIn(true);
        const updatedUser = await fetchLoginData(uid);

        return user;
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
          id: uid,
          email: email,
          status: "online",
          profile: {
            ...user?.profile,
            username: username || "", // Ensure username is a string
          },
          hasCompletedOnboarding: onboarded,
        };

        setUser(updatedUser);

        setCurrentView(onboarded ? "welcome" : "setUsername");

        // Verify if Steam is linked
        await verifySteamAccount(uid);

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
    if (!user || !user.id) return;
    await fetchServerData(user.id);
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
        changeUsername,
        checkUsernameExistence,
        setIsVerifying,
        isVerifying,
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
