// components/Settings/tabs/OptionsTab.tsx

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@components/ui/switch";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { FeatureNotAvailable, SteamAuthModal } from "../reusable";
import { useAuth } from "@context/AuthContext";
import { useFeatureFlags } from "@context/FeatureFlagContext";
import { FeatureFlagKeys } from "@utils/featureFlags";
import ConfirmActionModal from "../../Reusable/ConfirmActionModal";
import { Slider } from "@radix-ui/react-slider";
import { Copy } from "lucide-react";

interface OptionsTabProps {
  isSteamLinked: boolean;
  steamId: string;
}

const OptionsTab: React.FC<OptionsTabProps> = ({ isSteamLinked, steamId }) => {
  const { isFeatureEnabled } = useFeatureFlags();
  const { unlinkSteam, getEmail } = useAuth();
  const [isSteamModalOpen, setIsSteamModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // State variables
  const [steamTradeURL, setSteamTradeURL] = useState(
    "https://steamcommunity.com/..."
  );
  const [displayName, setDisplayName] = useState("CoolGuy");
  const [email, setEmail] = useState(getEmail() ?? 'admin@sink.gg');
  const [hideStats, setHideStats] = useState(false);
  const [receivePromos, setReceivePromos] = useState(true);
  const [chatOnRight, setChatOnRight] = useState(false);
  const [streamerMode, setStreamerMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [mainVolume, setMainVolume] = useState(7);
  const [liveFeedVolume, setLiveFeedVolume] = useState(8);
  const [notificationsVolume, setNotificationsVolume] = useState(6);
  const [disableHelpTours, setDisableHelpTours] = useState(true);
  const [wheelOfFortuneSounds, setWheelOfFortuneSounds] = useState(true);
  const [simplifiedBetInterface, setSimplifiedBetInterface] = useState(true);
  const [devMode, setDevMode] = useState(true);

  // Handle Unlink Steam action is now managed within ConfirmActionModal

  return (
    <div className="space-y-6">
      {/* ACCOUNT Section */}
      {isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_ACCOUNT) && (
        <motion.div
          className="bg-zinc-950/50 p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-bold text-white">ACCOUNT</h3>
          {/* Steam Trade URL */}
          {isFeatureEnabled(
            FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_ACCOUNT_STEAM_TRADE_URL
          ) && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Steam Trade URL
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={steamTradeURL}
                  onChange={(e) => setSteamTradeURL(e.target.value)}
                  className="flex-grow bg-[#2a2a2a] border-none text-white"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-[#3d3d3d] hover:bg-[#4a4a4a]">
                    SAVE
                  </Button>
                </motion.div>
              </div>
              <p className="text-sm text-gray-400">
                Your trade URL is required to send you items. You can find it{" "}
                <a href="#" className="text-[#c75d38]">
                  here
                </a>
                .
              </p>
            </div>
          )}
          {/* Display Name */}
          {isFeatureEnabled(
            FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_ACCOUNT_DISPLAY_NAME
          ) && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Display Name</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="flex-grow bg-[#2a2a2a] border-none text-white"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-[#3d3d3d] hover:bg-[#4a4a4a]">
                    SAVE
                  </Button>
                </motion.div>
              </div>
              <p className="text-sm text-gray-400">
                (Max 28 chars, no websites or bad words)
              </p>
            </div>
          )}
          {/* Email Address */}
          {isFeatureEnabled(
            FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_ACCOUNT_EMAIL_ADDRESS
          ) && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email Address</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow bg-zinc-900/35 border-zinc-900 one text-white"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-[#151515] hover:bg-[#202020]">
                    UPDATE
                  </Button>
                </motion.div>
              </div>
              <p className="text-sm text-gray-400 hidden">
                Receive free promo codes, important account updates, and other
                rewards. We don't spam!
              </p>
            </div>
          )}
          {/* Hide Stats */}
          {isFeatureEnabled(
            FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_ACCOUNT_HIDE_STATS
          ) && (
            <div className="flex items-center justify-between">
              <span>Hide stats from public</span>
              <Switch checked={hideStats} onCheckedChange={setHideStats} />
            </div>
          )}
        </motion.div>
      )}

      {/* BLOCKED USERS Section */}
      {isFeatureEnabled(
        FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_BLOCKED_USERS
      ) && (
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-bold text-white">BLOCKED USERS</h3>
          <p className="text-gray-400">
            Comms from these users will not be shown to you.
          </p>
          <p className="text-gray-500">No users blocked</p>
        </motion.div>
      )}

      {/* CONNECTIONS Section */}
      {isFeatureEnabled(
        FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_CONNECTIONS
      ) && (
        <motion.div
          className="bg-zinc-950/50 p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-white">CONNECTIONS</h3>
          {/* Discord Connection */}
          {isFeatureEnabled(
            FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_CONNECTIONS_DISCORD
          ) && (
            <div className="flex items-center justify-between">
              <span>Discord</span>
              <FeatureNotAvailable
                title="Discord Connection"
                description="This feature is not available yet. We're working on it and will notify you when it's ready!"
              />
            </div>
          )}
          {/* Steam Connection */}
          <div className="flex items-center justify-between">
            <div>
              <span className="block">Steam</span>
              {isSteamLinked && steamId && (
                <span className="text-sm text-gray-500">
                  Steam ID: {steamId}
                </span>
              )}
            </div>
            {isSteamLinked ? (
              isFeatureEnabled(
                FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_CONNECTIONS_UNLINK_STEAM
              ) && (
                <>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => setIsConfirmModalOpen(true)}
                  >
                    Unlink Steam
                  </Button>
                </>
              )
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-[#151515] hover:bg-[#202020]"
                  onClick={() => setIsSteamModalOpen(true)}
                >
                  + LINK ACCOUNT
                </Button>
                <SteamAuthModal
                  isOpen={isSteamModalOpen}
                  onClose={() => setIsSteamModalOpen(false)}
                />
              </motion.div>
            )}
          </div>
          {/* Receive Promos */}
          {isFeatureEnabled(
            FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_CONNECTIONS_RECEIVE_PROMOS
          ) && (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={receivePromos}
                onChange={(e) => setReceivePromos(e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm text-gray-400">
                I want to receive free promo codes & updates in the future
              </label>
            </div>
          )}
        </motion.div>
      )}

      {/* USER INTERFACE Section */}
      {isFeatureEnabled(
        FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_USER_INTERFACE
      ) && (
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-bold text-white">USER INTERFACE</h3>
          {/* Chat on Right Side */}
          {isFeatureEnabled(
            FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_USER_INTERFACE_CHAT_ON_RIGHT_SIDE
          ) && (
            <div className="flex items-center justify-between">
              <span>CHAT ON RIGHT SIDE</span>
              <Switch checked={chatOnRight} onCheckedChange={setChatOnRight} />
            </div>
          )}
          {/* Streamer Mode */}
          {isFeatureEnabled(
            FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_USER_INTERFACE_STREAMER_MODE
          ) && (
            <div className="flex items-center justify-between">
              <span>STREAMER MODE</span>
              <Switch
                checked={streamerMode}
                onCheckedChange={setStreamerMode}
              />
            </div>
          )}
          {/* Language Selection */}
          {isFeatureEnabled(
            FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_USER_INTERFACE_LANGUAGE
          ) && (
            <div className="flex items-center justify-between">
              <span>LANGUAGE</span>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px] bg-[#2a2a2a] border-none">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </motion.div>
      )}

      {/* AUDIO Section */}
      {isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_AUDIO) && (
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-bold text-white">AUDIO</h3>
          <div className="space-y-4">
            {/* Main Volume */}
            {isFeatureEnabled(
              FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_AUDIO_MAIN_VOLUME
            ) && (
              <div className="flex items-center justify-between">
                <span>MAIN VOLUME</span>
                <div className="w-64">
                  <Slider
                    value={[mainVolume]}
                    onValueChange={([value]) => setMainVolume(value)}
                    max={10}
                    step={1}
                  />
                </div>
              </div>
            )}
            {/* Live Feed Volume */}
            {isFeatureEnabled(
              FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_AUDIO_LIVE_FEED_VOLUME
            ) && (
              <div className="flex items-center justify-between">
                <span>LIVE FEED VOLUME</span>
                <div className="w-64">
                  <Slider
                    value={[liveFeedVolume]}
                    onValueChange={([value]) => setLiveFeedVolume(value)}
                    max={10}
                    step={1}
                  />
                </div>
              </div>
            )}
            {/* Notifications Volume */}
            {isFeatureEnabled(
              FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_AUDIO_NOTIFICATIONS_VOLUME
            ) && (
              <div className="flex items-center justify-between">
                <span>NOTIFICATIONS VOLUME</span>
                <div className="w-64">
                  <Slider
                    value={[notificationsVolume]}
                    onValueChange={([value]) => setNotificationsVolume(value)}
                    max={10}
                    step={1}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* TIPS & TOURS Section */}
      {isFeatureEnabled(
        FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_TIPS_AND_TOURS
      ) && (
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-white">TIPS & TOURS</h3>
          {/* Disable Help Tours */}
          {isFeatureEnabled(
            FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_TIPS_AND_TOURS_DISABLE_HELP_TOURS
          ) && (
            <div className="flex items-center justify-between">
              <span>DISABLE HELP TOURS</span>
              <Switch
                checked={disableHelpTours}
                onCheckedChange={setDisableHelpTours}
              />
            </div>
          )}
          {/* Reset All Tours */}
          {isFeatureEnabled(
            FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_TIPS_AND_TOURS_RESET_ALL_TOURS
          ) && (
            <div className="flex items-center justify-between">
              <span>RESET ALL TOURS</span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-[#3d3d3d] hover:bg-[#4a4a4a]">
                  RESET TOURS
                </Button>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}

      {/* DEV MODE Section */}
      {isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_DEV_MODE) && (
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          <h3 className="text-lg font-bold text-white">DEV MODE</h3>
          <div className="flex items-center justify-between">
            <span>DEV MODE</span>
            <Switch checked={devMode} onCheckedChange={setDevMode} />
          </div>
        </motion.div>
      )}

      {/* FAIRNESS Section (Future Feature) */}
      {isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS_FAIRNESS) && (
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4 hidden" // Hidden for now
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-lg font-bold text-white">FAIRNESS</h3>
          <p className="text-gray-400">
            Your server and client secret pair is what makes your games provably
            fair.
          </p>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Current server seed (hashed)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value="9DF9MJFNWbr24iub24RKEv"
                readOnly
                className="flex-grow bg-[#2a2a2a] border-none text-white"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-[#3d3d3d] hover:bg-[#4a4a4a]">
                  <Copy className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Current client seed
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value="J4U4S9Jh4"
                readOnly
                className="flex-grow bg-[#2a2a2a] border-none text-white"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-[#3d3d3d] hover:bg-[#4a4a4a]">
                  <Copy className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Confirmation Modal for Unlinking Steam */}
      <ConfirmActionModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={unlinkSteam}
        title="Confirm Unlink Steam"
        description="Are you sure you want to unlink your Steam account? This action cannot be undone."
        confirmText="Unlink"
        cancelText="Cancel"
        successResponse="Steam account unlinked successfully!"
        pendingResponse="Unlinking Steam..."
        failResponse="Failed to unlink Steam account."
      />
    </div>
  );
};

export default OptionsTab;
