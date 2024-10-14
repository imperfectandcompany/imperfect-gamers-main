// Header.tsx

import React, { useState } from "react";
import { Input } from "@components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import {
  Search,
  LogIn,
  Check,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { motion } from "framer-motion";
import { SettingsDialog } from "../Settings";

interface HeaderProps {
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean | undefined;
  onOpenAuthModal: (message?: string) => void;
  // linkSteam: () => void;
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

  const [isOpen, setIsOpen] = useState(false);

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
            <div className="relative hidden">
              <Input
                type="text"
                placeholder="Search players..."
                className="w-64 bg-zinc-900 border-zinc-700 pr-10 text-white"
                aria-label="Search players"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-zinc-400" />
              </Button>
            </div>
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
                      <DropdownMenuItem
                        onClick={() => openSettings("ACCOUNT")}
                        className="focus:bg-zinc-700 focus:text-white"
                      >
                        Account
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openSettings("SECURITY")}
                        className="focus:bg-zinc-700 focus:text-white"
                      >
                        Security
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openSettings("AFFILIATES")}
                        className="focus:bg-zinc-700 focus:text-white"
                      >
                        Affiliates
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openSettings("OPTIONS")}
                        className="focus:bg-zinc-700 focus:text-white"
                      >
                        Options
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openSettings("TRANSACTIONS")}
                        className="focus:bg-zinc-700 focus:text-white"
                      >
                        Transactions
                      </DropdownMenuItem>
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
                </Button></motion.div>    
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
