import React, { useState, useEffect, useRef } from "react";
import {
  Gift,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Lock,
  Info,
  RefreshCw,
  LogOut,
  Copy,
  Check,
  Menu,
  X,
  Settings as SettingsIcon,
  AlertCircle,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
  MotionProps,
} from "framer-motion";
import Image from "next/image";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { toast } from "@hooks/use-toast";

// Types
type Rank = {
  title: string;
  color: string;
  icon: string;
};

type Level = {
  level: number;
  xp: number;
  rewards: string[];
  rank: Rank;
};

const ranks: Rank[] = [
  {
    title: "God III",
    color: "#8B0000",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/god.gif",
  },
  {
    title: "God II",
    color: "#8B0000",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/god.gif",
  },
  {
    title: "God I",
    color: "#8B0000",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/god.gif",
  },
  {
    title: "Royalty III",
    color: "#FF4500",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/royal3.png",
  },
  {
    title: "Royalty II",
    color: "#FF4500",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/royal2.png",
  },
  {
    title: "Royalty I",
    color: "#FF4500",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/royal1.png",
  },
  {
    title: "Legend III",
    color: "#FFA500",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/legend3.png",
  },
  {
    title: "Legend II",
    color: "#FFA500",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/legend2.png",
  },
  {
    title: "Legend I",
    color: "#FFA500",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/legend1.png",
  },
  {
    title: "Master III",
    color: "#32CD32",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/master3.png",
  },
  {
    title: "Master II",
    color: "#32CD32",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/master32.png",
  },
  {
    title: "Master I",
    color: "#32CD32",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/master1.png",
  },
  {
    title: "Diamond III",
    color: "#8A2BE2",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/dia3.png",
  },
  {
    title: "Diamond II",
    color: "#8A2BE2",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/dia2.png",
  },
  {
    title: "Diamond I",
    color: "#8A2BE2",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/dia1.png",
  },
  {
    title: "Platinum III",
    color: "#87CEFA",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/plat3.png",
  },
  {
    title: "Platinum II",
    color: "#87CEFA",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/plat2.png",
  },
  {
    title: "Platinum I",
    color: "#87CEFA",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/plat1.png",
  },
  {
    title: "Gold III",
    color: "#FFD700",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/gold3.png",
  },
  {
    title: "Gold II",
    color: "#FFD700",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/gold2.png",
  },
  {
    title: "Gold I",
    color: "#FFD700",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/gold1.png",
  },
  {
    title: "Silver III",
    color: "#C0C0C0",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/silver3.png",
  },
  {
    title: "Silver II",
    color: "#C0C0C0",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/silver2.png",
  },
  {
    title: "Silver I",
    color: "#C0C0C0",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/silver1.png",
  },
  {
    title: "Bronze III",
    color: "#CD7F32",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/unranked.png",
  },
  {
    title: "Bronze II",
    color: "#CD7F32",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/unranked.png",
  },
  {
    title: "Bronze I",
    color: "#CD7F32",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/unranked.png",
  },
  {
    title: "Unranked",
    color: "#FFFFFF",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/unranked.png",
  },
];

const levels: Level[] = [
  { level: 0, xp: 0, rewards: ["No rewards"], rank: ranks[ranks.length - 1] },
  {
    level: 1,
    xp: 1400,
    rewards: ["2x Tier 0 case"],
    rank: ranks[ranks.length - 2],
  },
  {
    level: 2,
    xp: 3300,
    rewards: ["2x Tier 0 case"],
    rank: ranks[ranks.length - 3],
  },
  {
    level: 3,
    xp: 6000,
    rewards: ["2x Tier 0 case", "Access to chat"],
    rank: ranks[ranks.length - 4],
  },
  {
    level: 4,
    xp: 9600,
    rewards: ["2x Tier 0 case"],
    rank: ranks[ranks.length - 5],
  },
  {
    level: 5,
    xp: 14400,
    rewards: ["3x Tier 0 case"],
    rank: ranks[ranks.length - 6],
  },
  {
    level: 6,
    xp: 20400,
    rewards: ["2x Tier I case"],
    rank: ranks[ranks.length - 7],
  },
  {
    level: 7,
    xp: 27600,
    rewards: ["2x Tier I case", "Custom avatar frame"],
    rank: ranks[ranks.length - 8],
  },
  {
    level: 8,
    xp: 36000,
    rewards: ["3x Tier I case"],
    rank: ranks[ranks.length - 9],
  },
  {
    level: 9,
    xp: 45600,
    rewards: ["2x Tier II case"],
    rank: ranks[ranks.length - 10],
  },
  {
    level: 10,
    xp: 56400,
    rewards: ["2x Tier II case", "Custom chat color"],
    rank: ranks[ranks.length - 11],
  },
  {
    level: 11,
    xp: 68400,
    rewards: ["3x Tier II case"],
    rank: ranks[ranks.length - 12],
  },
  {
    level: 12,
    xp: 81600,
    rewards: ["2x Tier III case"],
    rank: ranks[ranks.length - 13],
  },
  {
    level: 13,
    xp: 96000,
    rewards: ["2x Tier III case", "Exclusive emote"],
    rank: ranks[ranks.length - 14],
  },
  {
    level: 14,
    xp: 111600,
    rewards: ["3x Tier III case"],
    rank: ranks[ranks.length - 15],
  },
  {
    level: 15,
    xp: 128400,
    rewards: ["Level up to see more ranks"],
    rank: ranks[0],
  },
];

const levelCases = [
  "0",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

const romanNumerals = [
  "0",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
];

// Reusable Components
type CustomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps & { className?: string };

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  className = "",
  ...props
}) => (
  <motion.button
    className={`text-white px-4 py-2 rounded font-medium ${className} ${
      props.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-80"
    }`}
    {...props}
  >
    {children}
  </motion.button>
);

const LevelCase: React.FC<{ tier: string }> = ({ tier }) => (
  <motion.div
    className="bg-[#2a2a2a] w-10 h-10 flex items-center justify-center rounded cursor-pointer"
    whileHover={{ scale: 1.1, backgroundColor: "#3a3a3a" }}
    whileTap={{ scale: 0.9 }}
  >
    <span className="text-xs font-bold text-[#c0c0c0]">{tier}</span>
  </motion.div>
);

const TabButton: React.FC<{
  tab: string;
  activeTab: string;
  onClick: (tab: string) => void;
}> = ({ tab, activeTab, onClick }) => (
  <motion.button
    className={`
      w-full text-left px-4 py-2 my-1 text-sm font-medium relative
      transition-colors duration-200 ease-in-out
      focus:outline-none
      ${
        activeTab === tab
          ? "text-white cursor-pointer"
          : "text-gray-400 hover:text-white"
      }
    `}
    onClick={() => onClick(tab)}
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      className={`
        absolute inset-y-0 left-0 w-1 rounded-r-md
        transition-colors duration-200 ease-in-out
        ${activeTab === tab ? "bg-[#c75d38]" : "bg-transparent"}
      `}
      initial={false}
      animate={{ height: activeTab === tab ? "100%" : "0%" }}
      transition={{ duration: 0.2 }}
    />
    <span className="relative z-10">{tab}</span>
  </motion.button>
);

const FeatureNotAvailable: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button className="bg-[#3d3d3d] hover:bg-[#4a4a4a]">
        + LINK ACCOUNT
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] text-white">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription className="text-gray-400">
          {description}
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);

const LevelCarousel: React.FC<{
  levels: Level[];
  currentLevelIndex: number;
  setCurrentLevelIndex: (index: number) => void;
}> = ({ levels, currentLevelIndex, setCurrentLevelIndex }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current!.offsetLeft);
    setScrollLeft(carouselRef.current!.scrollLeft);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current!.offsetLeft;
    const walk = (x - startX) * 3; // Scroll speed
    carouselRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleNavigation = (direction: "start" | "end" | "next" | "prev") => {
    let newIndex = currentLevelIndex;

    if (direction === "start") newIndex = 0;
    else if (direction === "end") newIndex = levels.length - 3;
    else if (direction === "next")
      newIndex = Math.min(levels.length - 3, currentLevelIndex + 1);
    else if (direction === "prev")
      newIndex = Math.max(0, currentLevelIndex - 1);

    setCurrentLevelIndex(newIndex);
    controls.start({ x: -newIndex * 33.33 + "%" });
  };

  useEffect(() => {
    controls.start({ x: -currentLevelIndex * 33.33 + "%" });
  }, [currentLevelIndex, controls]);

  return (
    <>
      <motion.div
        ref={carouselRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onMouseLeave={handleDragEnd}
        onMouseUp={handleDragEnd}
        onMouseMove={handleDragMove}
      >
        <motion.div
          className="flex"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          animate={controls}
        >
          {levels.map((level, index) => (
<motion.div
  key={level.level}
  className="bg-[#2a2a2a] p-4 rounded text-center m-2 transition-all duration-300 ease-in-out hover:bg-[#3a3a3a] w-full md:w-[calc(33.33%-1rem)] flex-shrink-0"
  style={{
    boxShadow: `0 ${4 + index * 2}px ${8 + index * 4}px rgba(0,0,0,${0.2 + index * 0.05})`,
  }}
  whileHover={{
    scale: 1.05,
    boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
  }}
  whileTap={{ scale: 0.95 }}
>
              <motion.div
                className="bg-[#1a1a1a] w-8 h-8 flex items-center justify-center rounded-md mx-auto mb-2"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-xs font-bold text-[#c0c0c0]">
                  {romanNumerals[level.level]}
                </span>
              </motion.div>
              <h4 className="font-bold text-[#c0c0c0]">Level {level.level}</h4>
              <p className="text-sm text-gray-400">
                {level.xp.toLocaleString()} XP
              </p>
              <motion.div
                className="mt-2 flex justify-center items-center h-12"
                whileHover={{ scale: 1.1 }}
              >
                <Image
                  src={level.rank.icon}
                  alt={level.rank.title}
                  width={32}
                  height={32}
                />
              </motion.div>
              <p
                className="text-sm font-bold"
                style={{ color: level.rank.color }}
              >
                {level.rank.title}
              </p>
              {level.rewards.map((reward, rewardIndex) => (
                <p key={rewardIndex} className="text-sm text-[#c0c0c0]">
                  - {reward}
                </p>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <div className="flex justify-between mt-4">
        <CustomButton
          onClick={() => handleNavigation("start")}
          disabled={currentLevelIndex === 0}
        >
          <ChevronsLeft className="w-6 h-6" />
        </CustomButton>
        <CustomButton
          onClick={() => handleNavigation("prev")}
          disabled={currentLevelIndex === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </CustomButton>
        <CustomButton
          onClick={() => handleNavigation("next")}
          disabled={currentLevelIndex >= levels.length - 3}
        >
          <ChevronRight className="w-6 h-6" />
        </CustomButton>
        <CustomButton
          onClick={() => handleNavigation("end")}
          disabled={currentLevelIndex >= levels.length - 3}
        >
          <ChevronsRight className="w-6 h-6" />
        </CustomButton>
      </div>
    </>
  );
};

// Tab Components
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
          {levelCases.map((tier, index) => (
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

const SecurityTab: React.FC = () => {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    {
      device: "Chrominum (P0)",
      location: "MI, US",
      ip: "127.0.0.1",
      date: "Current session",
    },
    {
      device: "Chrominum (P0)",
      location: "MI, US",
      ip: "127.0.0.1",
      date: "3h",
    },
  ]);

  return (
    <div className="space-y-6">
      <motion.div
        className="bg-[#1a1a1a] p-4 rounded space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-bold text-white">
          TWO-FACTOR AUTHENTICATION
        </h3>
        <p className="text-gray-400">
          Set up 2FA to add an additional layer of security when logging into
          your Clydent account.
        </p>
        <motion.div
          className="bg-[#2a2a2a] p-4 rounded flex items-start"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Info className="w-5 h-5 text-[#c75d38] mr-2 mt-1 flex-shrink-0" />
          <div>
            <h4 className="text-[#c75d38] font-bold">EMAIL ADDRESS REQUIRED</h4>
            <p className="text-gray-400">
              You need to have a verified email address linked to your account
              to begin the 2FA setup.
            </p>
          </div>
        </motion.div>
        <div className="flex items-center justify-between">
          <span className="text-white">Enable Two-Factor Authentication</span>
          <Switch checked={twoFAEnabled} onCheckedChange={setTwoFAEnabled} />
        </div>
      </motion.div>

      <motion.div
        className="bg-[#1a1a1a] p-4 rounded space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">ACTIVE SESSIONS</h3>
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        <p className="text-gray-400">
          If you don't recognize one of these logins, you should log out of all
          devices and change your Steam password immediately. Your Steam and
          Clydent account may be compromised.
        </p>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSessions.map((session, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <TableCell>{session.device}</TableCell>
                  <TableCell>
                    {session.location}
                    <br />
                    <span className="text-gray-500">{session.ip}</span>
                  </TableCell>
                  <TableCell>{session.date}</TableCell>
                  <TableCell>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button variant="ghost" size="sm">
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center">
          <Select defaultValue="10">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 rows</SelectItem>
              <SelectItem value="20">20 rows</SelectItem>
              <SelectItem value="50">50 rows</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-gray-400">1-2 of 2</div>
        </div>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button className="w-full bg-[#c75d38] hover:bg-[#d76d48] text-white">
          LOG OUT EVERYWHERE
        </Button>
      </motion.div>
    </div>
  );
};

const AffiliatesTab: React.FC = () => {
  const [referralCode, setReferralCode] = useState("COOLGUY2025");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <motion.div
        className="bg-[#1a1a1a] p-4 rounded space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-bold text-white">Your Referral Code</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={referralCode}
            readOnly
            className="flex-grow bg-[#2a2a2a] border-none text-white"
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-[#3d3d3d] hover:bg-[#4a4a4a]"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </motion.div>
        </div>
        <p className="text-sm text-gray-400">
          Share this code with your friends to earn rewards!
        </p>
      </motion.div>

      <motion.div
        className="bg-[#1a1a1a] p-4 rounded space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-lg font-bold text-white">Affiliate Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-sm text-gray-400">Total Referrals</p>
            <p className="text-2xl font-bold text-white">23</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-sm text-gray-400">Total Earnings</p>
            <p className="text-2xl font-bold text-white">$156.75</p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="bg-[#1a1a1a] p-4 rounded space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-bold text-white">Recent Referrals</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead>Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <motion.tr
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <TableCell>User123</TableCell>
                <TableCell>2023-07-01</TableCell>
                <TableCell>$5.25</TableCell>
              </motion.tr>
              <motion.tr
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <TableCell>GamerPro</TableCell>
                <TableCell>2023-06-28</TableCell>
                <TableCell>$3.50</TableCell>
              </motion.tr>
              <motion.tr
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <TableCell>CoolDude99</TableCell>
                <TableCell>2023-06-25</TableCell>
                <TableCell>$7.80</TableCell>
              </motion.tr>
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <motion.div
        className="bg-[#1a1a1a] p-4 rounded space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-bold text-white">Affiliate Terms</h3>
        <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            You earn 5% of your referrals' subscription for the first year.
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            You earn 2.5% if they used your referral to register an account
            (without subscription).
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Maximum earnings per user: 7.5% (5% + 2.5%) if they subscribe.
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Minimum payout is $10.
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            Payouts are processed weekly
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            Do not spam your referral code or use it in misleading ways
          </motion.li>
        </ul>
      </motion.div>
    </div>
  );
};

const OptionsTab: React.FC<{
  isSteamLinked: boolean;
  steamId: string;
  linkSteam: () => void;
}> = ({ linkSteam, steamId, isSteamLinked }) => {
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
            {isSteamLinked && (
              <span className="text-sm text-gray-500">{steamId}</span>
            )}
          </div>
          {isSteamLinked ? (
            <Button disabled className="bg-green-500 hover:bg-green-600">
              Linked
            </Button>
          ) : (
            <Button
              className="bg-[#3d3d3d] hover:bg-[#4a4a4a]"
              onClick={linkSteam} // Call linkSteam on click
            >
              + LINK ACCOUNT
            </Button>
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
                <Copy className="w-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const TransactionsTab: React.FC = () => {
    const [transactions, setTransactions] = useState([
        {
          id: 1,
          date: "2023-07-05",
          type: "Subscription",
          description: "Premium Membership",
          amount: 12.0,
          status: "Active",
          nextRenewal: "2023-08-05",
        },
        {
          id: 2,
          date: "2023-07-04",
          type: "Withdrawal",
          description: "Withdrawal to PayPal",
          amount: 50.0,
          status: "Pending",
        },
        {
          id: 3,
          date: "2023-07-03",
          type: "Deposit",
          description: "Deposit from Bank",
          amount: 75.0,
          status: "Completed",
        },
      ]);

  return (
    <div className="space-y-4">
      <motion.div
        className="bg-[#1a1a1a] p-4 rounded space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Renewal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded ${
                        transaction.status === "Active"
                          ? "bg-green-500/50"
                          : transaction.status === "Pending"
                          ? "bg-yellow-500/50"
                          : "bg-red-500/50"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {transaction.type === "Subscription" &&
                    transaction.status === "Active" ? (
                      transaction.nextRenewal
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Select defaultValue="10">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 rows</SelectItem>
              <SelectItem value="20">20 rows</SelectItem>
              <SelectItem value="50">50 rows</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const SettingsPageContent: React.FC<{
  selectedTab: string;
  isSteamLinked: boolean;
  steamId: string;
  linkSteam: () => void;
}> = ({ linkSteam, steamId, isSteamLinked, selectedTab }) => {
  const [activeTab, setActiveTab] = useState(selectedTab || "ACCOUNT");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const tabs = ["ACCOUNT", "SECURITY", "AFFILIATES", "OPTIONS", "TRANSACTIONS"];

  useEffect(() => {
    setActiveTab(selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "ACCOUNT":
        return <AccountTab />;
      case "SECURITY":
        return <SecurityTab />;
      case "AFFILIATES":
        return <AffiliatesTab />;
      case "OPTIONS":
        return (
          <OptionsTab
            isSteamLinked={isSteamLinked}
            linkSteam={linkSteam}
            steamId={steamId}
          />
        );
      case "TRANSACTIONS":
        return <TransactionsTab />;
      default:
        return null;
    }
  };

  const MobileMenu = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute top-0 left-0 bottom-0 w-[240px] sm:w-[300px] bg-[#1a1a1a] p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-bold text-white">Settings</h2>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                {tabs.map((tab) => (
                  <TabButton
                    key={tab}
                    tab={tab}
                    activeTab={activeTab}
                    onClick={(tab) => {
                      setActiveTab(tab);
                      setIsMobileMenuOpen(false);
                    }}
                  />
                ))}
              </div>
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#151515] text-gray-300 font-sans">
      <motion.header
        className="bg-[#1a1a1a] p-4 flex items-center justify-between z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isMobile ? (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        ) : (
          <h1 className="text-xl font-bold text-white">Settings</h1>
        )}
        <motion.h1
          className="text-xl font-bold text-white"
          key={activeTab}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab}
        </motion.h1>
        <div className="w-6 h-6" /> {/* Placeholder for symmetry */}
      </motion.header>
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <motion.nav
            className="w-64 bg-[#1a1a1a] p-4 overflow-y-auto"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {tabs.map((tab, index) => (
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TabButton
                  tab={tab}
                  activeTab={activeTab}
                  onClick={setActiveTab}
                />
              </motion.div>
            ))}
          </motion.nav>
        )}
        <motion.main
          className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {renderTabContent()}
        </motion.main>
      </div>
      {isMobile && <MobileMenu />}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3a3a3a;
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4a4a4a;
        }
      `}</style>
    </div>
  );
};
