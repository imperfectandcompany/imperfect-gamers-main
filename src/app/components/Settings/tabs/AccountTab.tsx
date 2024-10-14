import React, { useState } from "react";
import {
  Gift,
  Lock,
  Info,
  RefreshCw,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@components/ui/button";
import CustomButton from "../reusable/CustomButton";
import { LevelCarousel, LevelCase } from "../reusable";
import { levels, levelCases } from "../reusable/LevelCarousel";

const AccountTab: React.FC = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [isSelfLocked, setIsSelfLocked] = useState(false);

  return (
    <div className="space-y-4">
      <motion.div
        className="bg-[#1e2e3e] p-4 rounded flex items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Gift className="w-6 h-6 mr-2 text-white" />
        <div>
          <span className="text-white font-bold">+30% XP BONUS</span>
          <p className="text-sm">
            Have at least{" "}
            <span className="text-[#c75d38]">5 ingame daily connections</span>{" "}
            in the last 7 days to qualify.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="bg-[#1a1a1a] p-4 rounded"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center mb-2">
          <motion.div
            className="w-12 h-12 bg-[#5a8c3f] rounded-md flex items-center justify-center mr-4"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-2xl font-bold">0</span>
          </motion.div>
          <div className="w-full">
            <div className="flex justify-between">
              <span className="font-bold">Level 0 (0 XP)</span>
              <span>1,400 XP</span>
            </div>
            <motion.div
              className="w-full bg-[#2a2a2a] h-2 rounded-full mt-1"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1 }}
            >
              <motion.div
                className="bg-[#5a8c3f] h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "0%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>
          </div>
        </div>
        <LevelCarousel
          levels={levels}
          currentLevelIndex={currentLevelIndex}
          setCurrentLevelIndex={setCurrentLevelIndex}
        />
      </motion.div>

      <motion.div
        className="bg-[#1a1a1a] p-4 rounded"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-bold mb-2 text-[#c0c0c0]">LEVEL CASES</h3>
        <p className="text-sm text-gray-400 mb-4">
          Click on a tier to see the contents of that case. Level cases are
          opened from highest to lowest tier.
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-2">
          {levelCases.map((tier: any, index: number) => (
            <LevelCase key={index} tier={tier} />
          ))}
        </div>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button className="w-full bg-[#1e2e3e] hover:bg-[#2e3e4e] text-[#4a89dc]">
          <Gift className="w-4 h-4 inline mr-2" />
          REDEEM REFERRAL CODE
        </Button>
      </motion.div>

      <motion.div
        className="bg-[#1a1a1a] p-4 rounded"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-bold mb-4 text-[#8bc34a]">
          FREE REWARDS STATS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            className="bg-[#2a2a2a] p-4 rounded text-center"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Gift className="w-6 h-6 mx-auto mb-2 text-[#8bc34a]" />
            <motion.span
              className="text-xl font-bold text-[#8bc34a]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              0.00
            </motion.span>
            <p className="text-sm text-gray-400">Total rewards claimed</p>
          </motion.div>
          <motion.div
            className="bg-[#2a2a2a] p-4 rounded text-center"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Gift className="w-6 h-6 mx-auto mb-2 text-[#8bc34a]" />
            <motion.span
              className="text-xl font-bold text-[#8bc34a]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              0.00
            </motion.span>
            <p className="text-sm text-gray-400">Leaderboard earnings</p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="bg-[#1a1a1a] p-4 rounded"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-lg font-bold mb-4 text-[#c0c0c0]">SELF-LOCK</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">
              Lock yourself out of the platform for a set period of time.
            </p>
            <p className="text-sm text-gray-400">
              Current status: {isSelfLocked ? "Locked" : "Unlocked"}
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <CustomButton
              onClick={() => setIsSelfLocked(!isSelfLocked)}
              className={`${
                isSelfLocked ? "bg-red-500" : "bg-green-500"
              } hover:bg-opacity-80`}
            >
              <Lock className="w-4 h-4 inline mr-2" />
              {isSelfLocked ? "Unlock" : "Lock"}
            </CustomButton>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountTab;