import React, { useState } from "react";
import {
  motion
} from "framer-motion";
import { Switch } from "@components/ui/switch";
import { Slider } from "@components/ui/slider";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { useAuth } from "@/app/context/AuthContext";
import { FeatureNotAvailable, SteamAuthModal } from "../reusable";
import { Copy } from "lucide-react";


const OptionsTab: React.FC<{
    isSteamLinked: boolean;
    steamId: string;
    // linkSteam: () => void;
    linkSteam: (steamId: string) => void;
  }> = ({ linkSteam, steamId, isSteamLinked }) => {
  
      const { user } = useAuth(); 
      const [isSteamModalOpen, setIsSteamModalOpen] = useState(false);
  
    const [steamTradeURL, setSteamTradeURL] = useState(
      "https://steamcommunity.com/..."
    );
    const [displayName, setDisplayName] = useState("CoolGuy");
    const [email, setEmail] = useState("admin@sink.gg");
    const [hideStats, setHideStats] = useState(false);
    const [receivePromos, setReceivePromos] = useState(true);
    const [chatOnRight, setChatOnRight] = useState(false);
    const [streamerMode, setStreamerMode] = useState(false);
    const [language, setLanguage] = useState("English");
    const [mainVolume, setMainVolume] = useState(7);
    const [itemsVolume, setItemsVolume] = useState(8);
    const [notificationsVolume, setNotificationsVolume] = useState(6);
    const [disableHelpTours, setDisableHelpTours] = useState(true);
    const [wheelOfFortuneSounds, setWheelOfFortuneSounds] = useState(true);
    const [simplifiedBetInterface, setSimplifiedBetInterface] = useState(true);
    const [devMode, setDevMode] = useState(true);
  
    return (
      <div className="space-y-6">
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-bold text-white">ACCOUNT</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Steam Trade URL</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={steamTradeURL}
                onChange={(e) => setSteamTradeURL(e.target.value)}
                className="flex-grow bg-[#2a2a2a] border-none text-white"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-[#3d3d3d] hover:bg-[#4a4a4a]">SAVE</Button>
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
          <div className="space-y-2">
            <label className="block text-sm font-medium">Display name</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-grow bg-[#2a2a2a] border-none text-white"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-[#3d3d3d] hover:bg-[#4a4a4a]">SAVE</Button>
              </motion.div>
            </div>
            <p className="text-sm text-gray-400">
              (Max 28 chars, no websites or bad words)
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Email address</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-[#2a2a2a] border-none text-white"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-[#3d3d3d] hover:bg-[#4a4a4a]">
                  UPDATE
                </Button>
              </motion.div>
            </div>
            <p className="text-sm text-gray-400">
              Receive free promo codes, important account updates and other
              rewards. We don't spam!
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span>Hide stats from public</span>
            <Switch checked={hideStats} onCheckedChange={setHideStats} />
          </div>
        </motion.div>
  
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
  
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-white">CONNECTIONS</h3>
          <div className="flex items-center justify-between">
            <span>Discord</span>
            <FeatureNotAvailable
              title="Discord Connection"
              description="This feature is not available yet. We're working on it and will notify you when it's ready!"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="block">Steam</span>
              {user?.isSteamLinked && user.steamId && (
                <span className="text-sm text-gray-500">
                  Steam ID: {user.steamId}
                </span>
              )}
            </div>
            {user?.isSteamLinked ? (
              <Button disabled className="bg-green-500 hover:bg-green-600">
                Linked
              </Button>
            ) : (
              <>
                <Button
                  className="bg-[#3d3d3d] hover:bg-[#4a4a4a]"
                  onClick={() => setIsSteamModalOpen(true)}
                >
                  + LINK ACCOUNT
                </Button>
                <SteamAuthModal
                  isOpen={isSteamModalOpen}
                  onClose={() => setIsSteamModalOpen(false)}
                />
              </>
            )}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={receivePromos}
              onChange={(e) => setReceivePromos(e.target.checked)}
              className="mr-2"
            />
            <label className="text-sm text-gray-400">
              I want to receive free promo codes & updates in future
            </label>
          </div>
        </motion.div>
  
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-bold text-white">USER INTERFACE</h3>
          <div className="flex items-center justify-between">
            <span>CHAT ON RIGHT SIDE</span>
            <Switch checked={chatOnRight} onCheckedChange={setChatOnRight} />
          </div>
          <div className="flex items-center justify-between">
            <span>STREAMER MODE</span>
            <Switch checked={streamerMode} onCheckedChange={setStreamerMode} />
          </div>
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
        </motion.div>
  
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-bold text-white">AUDIO</h3>
          <div className="space-y-4">
            <div className="space-y-2">
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
              <div className="flex items-center justify-between">
                <span>LIVE FEED VOLUME</span>
                <div className="w-64">
                  <Slider
                    value={[itemsVolume]}
                    onValueChange={([value]) => setItemsVolume(value)}
                    max={10}
                    step={1}
                  />
                </div>
              </div>
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
            </div>
          </div>
        </motion.div>
  
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-white">TIPS & TOURS</h3>
          <div className="flex items-center justify-between">
            <span>DISABLE HELP TOURS</span>
            <Switch
              checked={disableHelpTours}
              onCheckedChange={setDisableHelpTours}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>RESET ALL TOURS</span>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-[#3d3d3d] hover:bg-[#4a4a4a]">
                RESET TOURS
              </Button>
            </motion.div>
          </div>
        </motion.div>
  
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
  {/* Will be setup for future giveaway system and random case opening system  */}
        <motion.div
          className="bg-[#1a1a1a] p-4 rounded space-y-4 hidden"
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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-[#3d3d3d] hover:bg-[#4a4a4a]">
                  <Copy className="w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  export default OptionsTab;