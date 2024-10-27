// components/Cards/UserStatsCard.tsx

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@components/ui/card";
import {
  Flame,
  Trophy,
  Zap,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { Progress } from "@components/ui/progress";
import { ScrollArea } from "@components/ui/scroll-area";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@components/ui/popover";
import { Button } from "@components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";

// Import GameStats and UserRecord interfaces
import { GameStats, UserRecord, styleMapping } from "@/app/interfaces/server2";
import { mapsAndBonuses } from "@/app/data/mapsAndBonuses";
import { mapsTypesAndTiers } from "@/app/data/mapsTypesAndTiers";

type MapType = string | "All";
type StyleType = string | "All";
type CompletionStatus = "Completed" | "In Progress" | "Not Started" | "All";
type TierType = string | "All";

interface UserStatsProps {
  isLoggedIn: boolean;
  isSteamLinked: boolean;
  hasServerData: boolean;
  hasCompletedOnboarding: boolean;
  gameStats: GameStats | null;
}

interface Rank {
  title: string;
  top: number;
  placement: number;
  percent: number;
  color: string;
  icon: string;
}

const colorMapping: { [key: string]: string } = {
  "{darkred}": "text-red-800",
  "{lightred}": "text-red-500",
  "{orange}": "text-orange-500",
  "{lime}": "text-lime-500",
  "{purple}": "text-purple-500",
  "{lightblue}": "text-blue-400",
  "{yellow}": "text-yellow-500",
  "{silver}": "text-gray-400",
  "{lightyellow}": "text-yellow-200",
  "{default}": "text-white",
};

const rankDefinitions: Rank[] = [
  {
    title: "[God III]",
    top: 0,
    placement: 1,
    percent: 0,
    color: "{darkred}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/god.gif",
  },
  {
    title: "[God II]",
    top: 0,
    placement: 2,
    percent: 0,
    color: "{darkred}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/god.gif",
  },
  {
    title: "[God I]",
    top: 0,
    placement: 3,
    percent: 0,
    color: "{darkred}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/god.gif",
  },
  {
    title: "[Royalty III]",
    top: 20,
    placement: 0,
    percent: 1,
    color: "{lightred}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/royal3.png",
  },
  {
    title: "[Royalty II]",
    top: 50,
    placement: 0,
    percent: 1,
    color: "{lightred}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/royal2.png",
  },
  {
    title: "[Royalty I]",
    top: 100,
    placement: 0,
    percent: 1,
    color: "{lightred}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/royal1.png",
  },
  {
    title: "[Legend III]",
    top: 0,
    placement: 0,
    percent: 1,
    color: "{orange}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/legend3.png",
  },
  {
    title: "[Legend II]",
    top: 0,
    placement: 0,
    percent: 5,
    color: "{orange}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/legend2.png",
  },
  {
    title: "[Legend I]",
    top: 0,
    placement: 0,
    percent: 10,
    color: "{orange}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/legend1.png",
  },
  {
    title: "[Master III]",
    top: 0,
    placement: 0,
    percent: 15,
    color: "{lime}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/master3.png",
  },
  {
    title: "[Master II]",
    top: 0,
    placement: 0,
    percent: 20,
    color: "{lime}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/master32.png",
  },
  {
    title: "[Master I]",
    top: 0,
    placement: 0,
    percent: 25,
    color: "{lime}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/master1.png",
  },
  {
    title: "[Diamond III]",
    top: 0,
    placement: 0,
    percent: 30,
    color: "{purple}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/dia3.png",
  },
  {
    title: "[Diamond II]",
    top: 0,
    placement: 0,
    percent: 35,
    color: "{purple}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/dia2.png",
  },
  {
    title: "[Diamond I]",
    top: 0,
    placement: 0,
    percent: 40,
    color: "{purple}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/dia1.png",
  },
  {
    title: "[Platinum III]",
    top: 0,
    placement: 0,
    percent: 45,
    color: "{lightblue}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/plat3.png",
  },
  {
    title: "[Platinum II]",
    top: 0,
    placement: 0,
    percent: 50,
    color: "{lightblue}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/plat2.png",
  },
  {
    title: "[Platinum I]",
    top: 0,
    placement: 0,
    percent: 55,
    color: "{lightblue}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/plat1.png",
  },
  {
    title: "[Gold III]",
    top: 0,
    placement: 0,
    percent: 60,
    color: "{yellow}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/gold3.png",
  },
  {
    title: "[Gold II]",
    top: 0,
    placement: 0,
    percent: 65,
    color: "{yellow}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/gold2.png",
  },
  {
    title: "[Gold I]",
    top: 0,
    placement: 0,
    percent: 70,
    color: "{yellow}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/gold1.png",
  },
  {
    title: "[Silver III]",
    top: 0,
    placement: 0,
    percent: 75,
    color: "{silver}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/silver3.png",
  },
  {
    title: "[Silver II]",
    top: 0,
    placement: 0,
    percent: 80,
    color: "{silver}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/silver2.png",
  },
  {
    title: "[Silver I]",
    top: 0,
    placement: 0,
    percent: 85,
    color: "{silver}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/silver1.png",
  },
  {
    title: "[Bronze III]",
    top: 0,
    placement: 0,
    percent: 90,
    color: "{lightyellow}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/Imperfect-SharpTimer/dev/remote_data/rank_icons/bronze.png",
  },
  {
    title: "[Bronze II]",
    top: 0,
    placement: 0,
    percent: 95,
    color: "{lightyellow}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/Imperfect-SharpTimer/dev/remote_data/rank_icons/bronze.png",
  },
  {
    title: "[Bronze I]",
    top: 0,
    placement: 0,
    percent: 100,
    color: "{lightyellow}",
    icon: "https://raw.githubusercontent.com/imperfectandcompany/Imperfect-SharpTimer/dev/remote_data/rank_icons/bronze.png",
  },
  {
    title: "[Unranked]",
    color: "{default}",
    top: 0,
    placement: 0,
    percent: 0,
    icon: "https://raw.githubusercontent.com/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/unranked.png",
  },
];

const UserStatsCard: React.FC<UserStatsProps> = ({
  isLoggedIn,
  isSteamLinked,
  hasServerData,
  hasCompletedOnboarding,
  gameStats,
}) => {
  const [expandedMaps, setExpandedMaps] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    mapType: "All" as MapType,
    tier: "All" as TierType,
    style: "All" as StyleType,
    completionStatus: "All" as CompletionStatus,
  });
  const [sortBy, setSortBy] = useState<"Default" | "Last Finished" | "Tier">(
    "Default"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpand = (mapName: string) => {
    setExpandedMaps((prev) =>
      prev.includes(mapName)
        ? prev.filter((name) => name !== mapName)
        : [...prev, mapName]
    );
  };

  if (!isLoggedIn) {
    return (
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Flame className="mr-2 h-5 w-5 text-red-500" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-yellow-500">
            Please log in to see your stats.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Flame className="mr-2 h-5 w-5 text-red-500" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-yellow-500">
            Please complete your onboarding to view your stats.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isSteamLinked) {
    return (
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Flame className="mr-2 h-5 w-5 text-red-500" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-red-500">
            Please link your Steam account to view your detailed stats.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!hasServerData) {
    return (
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Flame className="mr-2 h-5 w-5 text-red-500" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-red-500">
            No server data found for your Steam account. Play on our server to
            generate stats.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!gameStats) {
    return (
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Flame className="mr-2 h-5 w-5 text-red-500" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-red-500">
            Failed to load your stats. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const {
    globalPoints,
    timesConnected,
    lastConnected,
    mapRecords,
    playerName,
    globalPlacement,
    totalGlobalPlayers,
  } = gameStats;

  const getPlayerRank = (
    placement: number,
    totalPlayers: number
  ): Rank => {
    if (placement === 0) {
      return rankDefinitions.find((rank) => rank.title === "[Unranked]")!;
    }

    const percentageRank = (placement / totalPlayers) * 100;

    const rank = rankDefinitions.find((r) =>
      (r.placement !== 0 && r.placement === placement) ||
      (r.top !== 0 && placement <= r.top) ||
      (r.percent !== 0 && percentageRank <= r.percent)
    );

    if (rank) {
      return rank;
    } else {
      return rankDefinitions.find((rank) => rank.title === "[Unranked]")!;
    }
  };

  const playerRank = getPlayerRank(globalPlacement, totalGlobalPlayers);

  const totalMaps = mapsAndBonuses.totalMaps || 0;
  const totalBonuses = mapsAndBonuses.totalBonuses || 0;

  const completedMapsSet = new Set<string>();
  const completedBonusesSet = new Set<string>();

  const userCompletedBonusesMap: { [mapName: string]: Set<string> } = {};
  const userLastFinishedMap: { [mapName: string]: number } = {};

  // Process mapRecords to populate completion data
  Object.entries(mapRecords).forEach(([mapName, styles]) => {
    Object.values(styles).forEach((records) => {
      records.forEach((record: UserRecord) => {
        const parentMapName = record.parentMapName || mapName;

        if (
          !userLastFinishedMap[parentMapName] ||
          userLastFinishedMap[parentMapName] < record.lastFinished
        ) {
          userLastFinishedMap[parentMapName] = record.lastFinished;
        }

        if (record.isBonus) {
          if (!userCompletedBonusesMap[parentMapName]) {
            userCompletedBonusesMap[parentMapName] = new Set<string>();
          }
          userCompletedBonusesMap[parentMapName].add(record.mapName);
          completedBonusesSet.add(`${parentMapName}:${record.mapName}`);
        } else {
          completedMapsSet.add(parentMapName);
        }
      });
    });
  });

  const mapsCompleted = completedMapsSet.size;
  const bonusesCompleted = completedBonusesSet.size;

  const totalCompletions = mapsCompleted + bonusesCompleted;

  const overallCompletionPercentage =
    totalMaps + totalBonuses > 0
      ? (totalCompletions / (totalMaps + totalBonuses)) * 100
      : 0;

  const formatTimestamp = (unixStamp: number) => {
    return formatDistanceToNow(new Date(unixStamp * 1000), {
      addSuffix: true,
    });
  };

  const allMapsWithCompletionStatus = mapsAndBonuses.maps.map((map) => {
    const isMapCompleted = completedMapsSet.has(map.name);
    const userCompletedBonuses =
      userCompletedBonusesMap[map.name] || new Set<string>();

    const totalBonusesForMap = map.bonuses.length;
    const completedBonusesForMap = userCompletedBonuses.size;

    let status: CompletionStatus = "Not Started";

    if (isMapCompleted && completedBonusesForMap === totalBonusesForMap) {
      status = "Completed";
    } else if (isMapCompleted || completedBonusesForMap > 0) {
      status = "In Progress";
    }

    const lastFinished = userLastFinishedMap[map.name] || null;

    const mapTierAndType = mapsTypesAndTiers[map.name] || {
      Tier: null,
      Type: null,
    };

    return {
      ...map,
      status,
      completedBonusesForMap,
      totalBonusesForMap,
      lastFinished,
      tier: mapTierAndType.Tier,
      type: mapTierAndType.Type,
    };
  });

  const allTiers = Array.from(
    new Set(
      allMapsWithCompletionStatus
        .map((map) => (map.tier ? map.tier.toString() : null))
        .filter(Boolean)
    )
  ).sort((a, b) => parseInt(a!) - parseInt(b!)) as string[];

  let displayedMaps = allMapsWithCompletionStatus.filter((map) => {
    const mapTypeMatch =
      filters.mapType === "All" || filters.mapType === map.type;

    const tierMatch =
      filters.tier === "All" || filters.tier === map.tier?.toString();

    const completionMatch =
      filters.completionStatus === "All" ||
      filters.completionStatus === map.status;

    const nameMatch = map.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return mapTypeMatch && tierMatch && completionMatch && nameMatch;
  });

  displayedMaps.sort((a, b) => {
    if (sortBy === "Last Finished") {
      const aTime = a.lastFinished || 0;
      const bTime = b.lastFinished || 0;
      return bTime - aTime;
    } else if (sortBy === "Tier") {
      const aTier = parseInt(a.tier?.toString() || "0");
      const bTier = parseInt(b.tier?.toString() || "0");
      return aTier - bTier;
    } else {
      const statusOrder = { Completed: 0, "In Progress": 1, "Not Started": 2 };
      const statusCompare = statusOrder[a.status] - statusOrder[b.status];
      if (statusCompare !== 0) {
        return statusCompare;
      } else {
        return a.name.localeCompare(b.name);
      }
    }
  });

 // Helper function to format bonus names
 const formatBonusName = (
  bonusMapName: string,
  parentMapName: string
): string => {
  const regex = new RegExp(`${parentMapName}_bonus(\\d+)`);
  const match = regex.exec(bonusMapName);
  if (match && match[1]) {
    return `Bonus ${match[1]}`;
  } else {
    return bonusMapName; // return as is if not matching the pattern
  }
};
  

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Flame className="mr-2 h-5 w-5 text-red-500" />
          Your Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 text-zinc-300">
          {/* Player Name and Rank */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-base font-semibold">Player:</span>
              <span className="text-base font-bold text-zinc-100">
                {playerName}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src={playerRank.icon}
                alt={playerRank.title}
                className="w-6 h-6"
              />
              <span
                className={`text-base font-bold ${
                  colorMapping[playerRank.color]
                }`}
              >
                {playerRank.title}
              </span>
              <span className="text-base font-semibold text-zinc-100">
                (#{globalPlacement} / {totalGlobalPlayers})
              </span>
            </div>
          </div>

          {/* Global Points */}
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold">Global Points:</span>
            <div className="flex items-center bg-gradient-to-r from-red-600 to-red-400 px-3 py-1 rounded-full">
              <span className="text-white font-bold text-base">
                {globalPoints}
              </span>
            </div>
          </div>

          {/* Overall Completion */}
          <div className="bg-zinc-700/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-zinc-300">
                Overall Completion
              </span>
              <span className="text-sm font-medium text-zinc-300">
                {Math.round(overallCompletionPercentage)}%
              </span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Progress
                    value={overallCompletionPercentage}
                    className="w-full h-2 bg-zinc-700"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total Completions: {totalCompletions}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Completion Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TourStatItem
              label="Maps"
              completed={mapsCompleted}
              total={totalMaps}
            />
            <TourStatItem
              label="Bonuses"
              completed={bonusesCompleted}
              total={totalBonuses}
            />
            <div className="flex flex-col items-center justify-center bg-zinc-700/50 rounded-lg p-4">
              <span className="text-sm text-zinc-400">Total Completions</span>
              <span className="text-2xl font-bold text-red-400">
                {totalCompletions}
              </span>
            </div>
          </div>

          {/* Times Connected & Last Connected */}
          <div className="text-sm space-y-2 bg-zinc-900 p-4 rounded-lg shadow-inner">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Times Connected</span>
              <span className="text-zinc-100 font-semibold">
                {timesConnected}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Last Connected</span>
              <span className="text-zinc-100 font-semibold flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatTimestamp(lastConnected)}
              </span>
            </div>
          </div>

          {/* User Records */}
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
              <h2 className="text-2xl font-bold text-red-400 flex items-center mb-2 sm:mb-0">
                <Trophy className="w-6 h-6 mr-2" />
                User Records
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                {/* Quick Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search maps..."
                    className="bg-zinc-700 text-zinc-100 p-2 pl-10 rounded text-sm w-full sm:w-auto"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                </div>
                {/* Sort By */}
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                          | "Default"
                          | "Last Finished"
                          | "Tier"
                      )
                    }
                    className="bg-zinc-700 text-zinc-100 p-2 rounded text-sm w-full sm:w-auto"
                  >
                    <option value="Default">Default</option>
                    <option value="Last Finished">Last Finished</option>
                    <option value="Tier">Tier</option>
                  </select>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-2 sm:mt-0 text-zinc-400 hover:text-zinc-100"
                    >
                      <Filter className="w-6 h-6" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 bg-zinc-800 border border-zinc-700 p-4 rounded-lg shadow-xl">
                    <h3 className="text-lg font-semibold mb-2 text-zinc-100">
                      Filters
                    </h3>
                    <div className="space-y-2">
                      {/* Map Type Filter */}
                      <div>
                        <label className="block text-zinc-300 mb-1">
                          Map Type
                        </label>
                        <select
                          value={filters.mapType}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              mapType: e.target.value as MapType,
                            })
                          }
                          className="w-full bg-zinc-700 text-zinc-100 p-2 rounded"
                        >
                          <option value="All">All</option>
                          <option value="Linear">Linear</option>
                          <option value="Staged">Staged</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                      {/* Tier Filter */}
                      <div>
                        <label className="block text-zinc-300 mb-1">
                          Tier
                        </label>
                        <select
                          value={filters.tier}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              tier: e.target.value as TierType,
                            })
                          }
                          className="w-full bg-zinc-700 text-zinc-100 p-2 rounded"
                        >
                          <option value="All">All</option>
                          {allTiers.map((tier, index) => (
                            <option key={index} value={tier}>
                              Tier {tier}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Completion Status Filter */}
                      <div>
                        <label className="block text-zinc-300 mb-1">
                          Completion Status
                        </label>
                        <select
                          value={filters.completionStatus}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              completionStatus: e.target
                                .value as CompletionStatus,
                            })
                          }
                          className="w-full bg-zinc-700 text-zinc-100 p-2 rounded"
                        >
                          <option value="All">All</option>
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Not Started">Not Started</option>
                        </select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {/* Displayed Maps Count */}
            <p className="text-sm text-zinc-400 mb-2">
              Showing {displayedMaps.length} out of{" "}
              {allMapsWithCompletionStatus.length} maps
            </p>
            <ScrollArea className="h-96">
              <div className="space-y-4 pr-4">
                {displayedMaps.map((map) => (
                  <motion.div
                    key={map.name}
                    className={`bg-gradient-to-br from-zinc-700 to-zinc-600 rounded-lg p-4 text-sm shadow-md border border-zinc-500 relative ${
                      map.status === "Not Started" ? "opacity-50" : ""
                    }`}
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleExpand(map.name)}
                    >
                      <div>
                        <h4 className="font-semibold text-zinc-100">
                          {map.name}
                        </h4>
                        <p className="text-xs text-zinc-400">
                          Tier {map.tier || "N/A"} - {map.type || "N/A"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs font-semibold ${
                            map.status === "Completed"
                              ? "text-green-500"
                              : map.status === "In Progress"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {map.status}
                        </span>
                        <motion.div
                          animate={{
                            rotate: expandedMaps.includes(map.name) ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {expandedMaps.includes(map.name) ? (
                            <ChevronUp className="w-5 h-5 text-zinc-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-zinc-400" />
                          )}
                        </motion.div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedMaps.includes(map.name) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 space-y-3 overflow-hidden"
                        >
                          {map.status !== "Not Started" ? (
                            <>
                              {/* Display user's records */}
                              {Object.entries(
                                mapRecords[map.name] || {}
                              ).map(([styleName, records]) => (
                                <div
                                  key={styleName}
                                  className="pl-3 border-l-2 border-zinc-500"
                                >
                                  <p className="text-xs font-semibold text-emerald-400 flex items-center mb-2">
                                    <Zap className="w-3 h-3 mr-1" />
                                    {styleName}
                                  </p>
                                  {records.length > 0 ? (
                                    records.map(
                                      (record: UserRecord, index: number) => (
                                        <div key={index} className="mb-2">
                                          <p className="text-xs mb-1">
                                            <span className="text-zinc-400 font-semibold">
                                              {record.isBonus
                                                ? record.mapName
                                                : record.mapName}
                                              :
                                            </span>{" "}
                                            <span className="text-yellow-300 font-bold">
                                              {record.formattedTime}
                                            </span>
                                            <span className="text-zinc-500 ml-1">
                                              (
                                              {record.isStaged
                                                ? "Staged"
                                                : "Linear"}
                                              )
                                            </span>
                                          </p>
                                          <p className="text-xs text-zinc-400">
                                            Record Set:{" "}
                                            {formatTimestamp(
                                              record.unixStamp
                                            )}
                                          </p>
                                          <p className="text-xs text-zinc-400">
                                            Last Finished:{" "}
                                            {formatTimestamp(
                                              record.lastFinished
                                            )}
                                          </p>
                                          <p className="text-xs text-zinc-400">
                                            Times Finished:{" "}
                                            {record.timesFinished}
                                          </p>
                                          <p className="text-xs text-zinc-400">
                                            Rank: #{record.mapPlacement} /{" "}
                                            {record.totalMapPlayers}
                                          </p>
                                          {record.stageTimes && (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-1">
                                              {record.stageTimes.map(
                                                (stage, stageIndex) => (
                                                  <p
                                                    key={stageIndex}
                                                    className="text-xs"
                                                  >
                                                    <span className="text-zinc-500">
                                                      S{stage.stage}:
                                                    </span>{" "}
                                                    <span className="text-cyan-300">
                                                      {stage.formattedTime}
                                                    </span>
                                                  </p>
                                                )
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )
                                  ) : (
                                    <p className="text-xs text-zinc-400">
                                      No records found
                                    </p>
                                  )}
                                </div>
                              ))}
 {/* Display remaining bonuses if any */}
 {map.status === "In Progress" && (
                                    <div className="pl-3 border-l-2 border-zinc-500">
                                      <p className="text-xs font-semibold text-yellow-400 mb-2">
                                        Remaining to Complete:
                                      </p>
                                      <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                                        {!completedMapsSet.has(map.name) && (
                                          <li>Main Map</li>
                                        )}
                                        {map.bonuses
                                          .filter((bonus) => {
                                            const formattedBonusName =
                                              formatBonusName(bonus, map.name);
                                            const records =
                                              mapRecords[map.name] || {};
                                            const bonusCompletedInRecords =
                                              Object.values(records).some(
                                                (recordArray: UserRecord[]) =>
                                                  recordArray.some(
                                                    (record) =>
                                                      record.isBonus &&
                                                      formatBonusName(
                                                        record.mapName,
                                                        map.name
                                                      ) === formattedBonusName
                                                  )
                                              );
                                              return (
                                                !userCompletedBonusesMap[
                                                  map.name
                                                ]?.has(bonus) &&
                                                !bonusCompletedInRecords
                                              );
                                            })
                                            .map((bonus, index) => (
                                              <li key={index}>
                                                {formatBonusName(bonus, map.name)}
                                              </li>
                                            ))}
                                        </ul>
                                    </div>
                                  )}
                            </>
                          ) : (
                            <div className="text-xs text-zinc-400">
                              <p>You haven't started this map yet.</p>
                              <p>Bonuses: {map.bonuses.length}</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function component
function TourStatItem({
  label,
  completed,
  total,
}: {
  label: string;
  completed: number;
  total: number;
}) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center bg-zinc-700/50 rounded-lg p-4">
      <span className="text-sm text-zinc-400">{label}</span>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold text-zinc-100">
          {completed}
        </span>
        <span className="text-sm text-zinc-400">/ {total}</span>
      </div>
      <Progress value={percentage} className="w-full h-2 mt-2" />
    </div>
  );
}

export default UserStatsCard;
