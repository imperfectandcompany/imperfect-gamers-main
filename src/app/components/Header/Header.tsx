// components/Settings/Header.tsx

import React, { useState, useMemo } from "react";
import { Input } from "@components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import {
  LogIn,
  Check,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { motion } from "framer-motion";
import { SettingsDialog } from "../Settings";
import { useFeatureFlags } from '@context/FeatureFlagContext';
import { FeatureFlagKeys } from "@utils/featureFlags";

interface HeaderProps {
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean | undefined;
  onOpenAuthModal: (message?: string) => void;
  linkSteam: (steamId: string) => void;
  isSteamLinked: boolean;
  steamId: string;
  isVerifying: boolean;
  fidelity: number;
  shouldApplyBlur: boolean;
}

const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  hasCompletedOnboarding,
  isSteamLinked,
  steamId,
  onOpenAuthModal,
  linkSteam,
  isVerifying,
  fidelity,
  shouldApplyBlur,
}) => {
  const { user, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("ACCOUNT");
  const [isOpen, setIsOpen] = useState(false);

  const { isFeatureEnabled } = useFeatureFlags();

  // Define available tabs based on feature flags using useMemo
  const availableTabs = useMemo(() => [
    { key: 'ACCOUNT', label: 'Account', enabled: isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_ACCOUNT) },
    { key: 'SECURITY', label: 'Security', enabled: isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_SECURITY) },
    { key: 'AFFILIATES', label: 'Affiliates', enabled: isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_AFFILIATES) },
    { key: 'OPTIONS', label: 'Options', enabled: isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS) },
    { key: 'TRANSACTIONS', label: 'Transactions', enabled: isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_TRANSACTIONS) },
  ], [isFeatureEnabled]);

  const handleLoginClick = () => {
    onOpenAuthModal();
  };

  const handleVerifyClick = () => {
    onOpenAuthModal();
  };

  const handleLogout = () => {
    logout();
  };

  const openSettings = (tab: string) => {
    setSelectedTab(tab);
    setIsSettingsOpen(true);
  };

  const blur = Math.max(20 - fidelity / 5, 0);
  const opacity = fidelity / 100;

  return (
    <header className="bg-zinc-950 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="https://cdn.imperfectgamers.org/inc/assets/img/logo.svg?height=40&width=40"
              alt="Imperfect Gamers Community Logo"
              className="h-10"
            />
            <span className="text-xl font-bold text-white">
              Imperfect Gamers
            </span>
          </div>
          <nav className="flex items-center space-x-4">
            {isLoggedIn ? (
              hasCompletedOnboarding ? (
                <motion.div
                  style={
                    shouldApplyBlur
                      ? { filter: `blur(${blur}px)`, opacity }
                      : {}
                  }
                >
                  <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center space-x-1 bg-transparent text-white hover:bg-zinc-800 px-2 py-1 rounded">
                        <span>{user?.userName || "User"}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      alignOffset={-4}
                      className="w-56 bg-zinc-800 text-white border-zinc-700"
                    >
                      {availableTabs.filter(tab => tab.enabled).map(tab => (
                        <DropdownMenuItem
                          key={tab.key}
                          onClick={() => openSettings(tab.key)}
                          className="focus:bg-zinc-700 focus:text-white"
                        >
                          {tab.label}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem
                        className="text-red-500 focus:bg-zinc-700 focus:text-red-500"
                        onSelect={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ) : (
                <motion.div
                  style={
                    shouldApplyBlur
                      ? { filter: `blur(${blur}px)`, opacity }
                      : {}
                  }
                >            
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center text-white"
                    onClick={handleVerifyClick}
                    aria-label="Verify Account"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Verify
                  </Button>
                </motion.div>    
              )
            ) : (
              <motion.div
                style={
                  shouldApplyBlur
                    ? { filter: `blur(${blur}px)`, opacity }
                    : {}
                }
              >   
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center text-white"
                  onClick={handleLoginClick}
                  aria-label="Log In"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Log In
                </Button>
              </motion.div>
            )}
          </nav>
        </div>
      </div>
      {/* Settings Dialog */}
      <SettingsDialog
        isSteamLinked={isSteamLinked}
        steamId={steamId}
        linkSteam={linkSteam}
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        selectedTab={selectedTab}
      />
    </header>
  );
};

export default Header;
