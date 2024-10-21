import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { useFeatureFlags } from "@context/FeatureFlagContext";
import { FeatureFlagKeys } from "@utils/featureFlags";

interface UserProfileProps {
  isLoggedIn: boolean;
  isSteamLinked: boolean;
  hasServerData: boolean;
  userName?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  isVip?: boolean;
  email?: string;
  timesConnected?: number;
  lastConnected?: number; // Unix timestamp
}

const UserProfileCard: React.FC<UserProfileProps> = ({
  isLoggedIn,
  isSteamLinked,
  hasServerData,
  userName,
  avatarUrl,
  isVerified,
  isVip,
  email,
  timesConnected,
  lastConnected,
}) => {
  const { isFeatureEnabled } = useFeatureFlags();

  if (!isLoggedIn) {
    return (
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-white">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <span className="text-6xl block mb-4">👤</span>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome, Guest!
            </h2>
            <p className="text-zinc-400 mb-4">
              Log in to view your profile and stats.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userName) {
    return (
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-white">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <span className="text-6xl block mb-4">👤</span>
            <p className="text-yellow-500 font-semibold">
              Username not set - Please complete your onboarding.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-white flex items-center">
          <span>User Profile</span>
          {!isVerified &&
            (!isVip ? (
              <>
                <span className="ml-2 px-2 py-1 text-xs font-semibold text-yellow-500 bg-zinc-700 rounded-full">
                  Not Premium
                </span>
              </>
            ) : (
              <span className="ml-2 px-2 py-1 text-xs font-semibold text-green-500 bg-zinc-700 rounded-full">
                Premium
              </span>
            ))}
        </CardTitle>
        <Button
          variant="default"
          className="hidden (hidden until we get to this point)"
        >
          View Profile
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <img
            src={avatarUrl}
            alt="Steam Avatar"
            className="w-20 h-20 rounded-full"
          />
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-white mb-2">{userName}</h2>
            {!isSteamLinked ? (
              <p className="text-yellow-500">
                Please link your Steam account to view detailed stats.
              </p>
            ) : hasServerData ? (
              <>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="flex-grow">
                    {email && (
                      <p className="text-zinc-400 mb-2">
                        <strong>Email:</strong> {email}
                      </p>
                    )}
                    {timesConnected !== undefined && (
                      <p className="text-zinc-400 mb-2">
                        <strong>Times Connected:</strong> {timesConnected}
                      </p>
                    )}
                    {lastConnected !== undefined && (
                      <p className="text-zinc-400">
                        <strong>Last Connected:</strong>{" "}
                        {new Date(lastConnected * 1000).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-yellow-500">
                No server data found for your Steam account.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
