import { useAnimation, motion } from "framer-motion";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import CustomButton from "./CustomButton";

// Types
export type Rank = {
  title: string;
  color: string;
  icon: string;
};

export type Level = {
  level: number;
  xp: number;
  rewards: string[];
  rank: Rank;
};

export const ranks: Rank[] = [
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

export const levels: Level[] = [
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

export const levelCases = [
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
                boxShadow: `0 ${4 + index * 2}px ${
                  8 + index * 4
                }px rgba(0,0,0,${0.2 + index * 0.05})`,
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
                <img
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

export default LevelCarousel;