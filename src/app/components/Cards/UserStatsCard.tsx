// components/Cards/UserStatsCard.tsx

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
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
import { ToggleGroup, ToggleGroupItem } from "@components/ui/toggle-group";

// Import GameStats and UserRecord interfaces
import { GameStats, UserRecord } from "@/app/interfaces/server2";
import { mapsAndBonuses } from "@/app/data/mapsAndBonuses";
import { mapsTypesAndTiers } from "@/app/data/mapsTypesAndTiers";
import { Rank, rankDefinitions } from "@/app/data/playerRanks";

// Define types
type MapType = "All" | "Linear" | "Staged" | "Hybrid";
type CompletionStatus = "All" | "Completed" | "In Progress" | "Not Started";
type TierType = string;
type SortBy = "Default" | "Last Finished";
type StyleType = string | "All";

// Updated Filters Interface
interface Filters {
  mapType: MapType[];
  tiers: TierType[];
  style: StyleType;
  completionStatus: CompletionStatus[];
}

interface UserStatsProps {
  isLoggedIn: boolean;
  isSteamLinked: boolean;
  hasServerData: boolean;
  hasCompletedOnboarding: boolean;
  gameStats: GameStats | null;
}

// Color mapping for ranks
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

// Define all possible Map Types and Completion Statuses
const allMapTypes: MapType[] = ["All", "Linear", "Staged", "Hybrid"];
const allCompletionStatuses: CompletionStatus[] = [
  "All",
  "Completed",
  "In Progress",
  "Not Started",
];

const UserStatsCard: React.FC<UserStatsProps> = ({
  isLoggedIn,
  isSteamLinked,
  hasServerData,
  hasCompletedOnboarding,
  gameStats,
}) => {
  const [expandedMaps, setExpandedMaps] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    mapType: ["All"],
    tiers: ["All"],
    style: "All",
    completionStatus: ["All"],
  });
  const [sortBy, setSortBy] = useState<SortBy>("Default");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpand = (mapName: string) => {
    setExpandedMaps((prev) =>
      prev.includes(mapName)
        ? prev.filter((name) => name !== mapName)
        : [...prev, mapName]
    );
  };

  // Early Returns for Various States
  if (!isLoggedIn) {
    return (
      <StatusCard
        message="Please log in to see your stats."
        icon={<Flame className="mr-2 h-5 w-5 text-red-500" />}
        title="Your Stats"
        color="text-yellow-500"
      />
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <StatusCard
        message="Please complete your onboarding to view your stats."
        icon={<Flame className="mr-2 h-5 w-5 text-red-500" />}
        title="Your Stats"
        color="text-yellow-500"
      />
    );
  }

  if (!isSteamLinked) {
    return (
      <StatusCard
        message="Please link your Steam account to view your detailed stats."
        icon={<Flame className="mr-2 h-5 w-5 text-red-500" />}
        title="Your Stats"
        color="text-red-500"
      />
    );
  }

  if (!hasServerData) {
    return (
      <StatusCard
        message="No server data found for your Steam account. Play on our server to generate stats."
        icon={<Flame className="mr-2 h-5 w-5 text-red-500" />}
        title="Your Stats"
        color="text-red-500"
      />
    );
  }

  if (!gameStats) {
    return (
      <StatusCard
        message="Failed to load your stats. Please try again later."
        icon={<Flame className="mr-2 h-5 w-5 text-red-500" />}
        title="Your Stats"
        color="text-red-500"
      />
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

  const getPlayerRank = (placement: number, totalPlayers: number): Rank => {
    if (placement === 0) {
      return rankDefinitions.find((rank) => rank.title === "[Unranked]")!;
    }

    const percentageRank = (placement / totalPlayers) * 100;

    const rank =
      rankDefinitions.find(
        (r) =>
          (r.placement !== 0 && r.placement === placement) ||
          (r.top !== 0 && placement <= r.top) ||
          (r.percent !== 0 && percentageRank <= r.percent)
      ) || rankDefinitions.find((rank) => rank.title === "[Unranked]")!;

    return rank;
  };

  const playerRank = getPlayerRank(globalPlacement, totalGlobalPlayers);

  const totalMaps = mapsAndBonuses.totalMaps || 0;
  const totalBonuses = mapsAndBonuses.totalBonuses || 0;

  // Initialize Sets and Maps for Completed Maps and Bonuses
  const completedMapsSet = useMemo(() => new Set<string>(), []);
  const completedBonusesSet = useMemo(() => new Set<string>(), []);
  const userCompletedBonusesMap: { [mapName: string]: Set<string> } = {};
  const userLastFinishedMap: { [mapName: string]: number } = {};

  // Populate Sets and Maps based on mapRecords
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

  // Compute All Maps with Completion Status
  const allMapsWithCompletionStatus = useMemo(
    () =>
      mapsAndBonuses.maps.map((map) => {
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
      }),
    [
      mapsAndBonuses.maps,
      completedMapsSet,
      completedBonusesSet,
      userCompletedBonusesMap,
      userLastFinishedMap,
    ]
  );

  // Extract All Tiers
  const allTiers = useMemo(
    () =>
      Array.from(
        new Set(
          allMapsWithCompletionStatus
            .map((map) => (map.tier ? map.tier.toString() : null))
            .filter(Boolean)
        )
      ).sort((a, b) => parseInt(a!) - parseInt(b!)) as string[],
    [allMapsWithCompletionStatus]
  );

  // Filtered and Sorted Maps
  let displayedMaps = useMemo(() => {
    return allMapsWithCompletionStatus.filter((map) => {
      const mapTypeMatch =
        filters.mapType.includes("All") ||
        (map.type && filters.mapType.includes(map.type as MapType));

      const tierMatch =
        filters.tiers.includes("All") ||
        (map.tier && filters.tiers.includes(map.tier.toString()));

      const completionMatch =
        filters.completionStatus.includes("All") ||
        filters.completionStatus.includes(map.status);

      const nameMatch = map.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return mapTypeMatch && tierMatch && completionMatch && nameMatch;
    });
  }, [allMapsWithCompletionStatus, filters, searchQuery]);

  // Sorting Logic
  displayedMaps.sort((a, b) => {
    if (sortBy === "Last Finished") {
      const aTime = a.lastFinished || 0;
      const bTime = b.lastFinished || 0;
      return bTime - aTime;
    } else {
      const statusOrder: { [key in CompletionStatus]: number } = {
        Completed: 0,
        "In Progress": 1,
        "Not Started": 2,
        All: 3,
      };
      const statusCompare = statusOrder[a.status] - statusOrder[b.status];
      if (statusCompare !== 0) {
        return statusCompare;
      } else {
        return a.name.localeCompare(b.name);
      }
    }
  });

  // Helper Function to Format Bonus Names
  const formatBonusName = (
    bonusMapName: string,
    parentMapName: string
  ): string => {
    const regex = new RegExp(`${parentMapName}_bonus(\\d+)`);
    const match = regex.exec(bonusMapName);
    if (match && match[1]) {
      return `Bonus ${match[1]}`;
    } else {
      return bonusMapName;
    }
  };

  return (
    <Card className="bg-zinc-950 border-zinc-800 shadow-lg w-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center text-lg md:text-xl">
          <Flame className="mr-2 h-6 w-6 text-red-500" />
          Your Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 text-zinc-300">
          {/* Player Name and Rank */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-base font-semibold">IGN:</span>
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
                  colorMapping[playerRank.color] || colorMapping["{default}"]
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
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <span className="text-base font-semibold">Global Points:</span>
            <div className="flex items-center bg-gradient-to-r from-red-600 to-red-400 px-6 py-3 rounded-full mt-2 sm:mt-0 transition-transform transform hover:scale-105">
              <span className="text-white font-bold text-lg">
                {globalPoints}
              </span>
            </div>
          </div>

          {/* Overall Completion */}
          <div className="bg-zinc-700/50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-3">
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
                    className="w-full h-3 bg-zinc-600 rounded"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total Completions: {totalCompletions}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Completion Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatItem
              label="Maps"
              completed={mapsCompleted}
              total={totalMaps}
              color="text-zinc-100"
            />
            <StatItem
              label="Bonuses"
              completed={bonusesCompleted}
              total={totalBonuses}
              color="text-zinc-100"
            />
            <div className="flex flex-col items-center justify-center bg-zinc-700/50 rounded-lg p-6">
              <span className="text-sm text-zinc-400">Total Completions</span>
              <span className="text-3xl font-bold text-red-400">
                {totalCompletions}
              </span>
            </div>
          </div>

          {/* Times Connected & Last Connected */}
          <div className="text-sm space-y-4 bg-zinc-900 p-6 rounded-lg shadow-inner">
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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <h2 className="text-2xl font-bold text-red-400 flex items-center mb-4 lg:mb-0">
                <Trophy className="w-6 h-6 mr-3" />
                User Records
              </h2>
              <UserRecordsControls
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                filters={filters}
                setFilters={setFilters}
                allTiers={allTiers}
              />
            </div>
            <p className="text-sm text-zinc-400 mb-4">
              Showing {displayedMaps.length} out of{" "}
              {allMapsWithCompletionStatus.length} maps
            </p>
            <ScrollArea className="h-96 overflow-y-auto">
              <div className="space-y-6 pr-4">
                {displayedMaps.length === 0 ? (
                  <div className="text-center text-zinc-400">
                    No maps match your criteria.
                  </div>
                ) : (
                  displayedMaps.map((map) => (
                    <motion.div
                      key={map.name}
                      className={`bg-gradient-to-br from-zinc-700 to-zinc-600 rounded-lg p-6 text-sm shadow-md border border-zinc-500 relative ${
                        map.status === "Not Started" ? "opacity-50" : ""
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="flex flex-col sm:flex-row items-center justify-between cursor-pointer"
                        onClick={() => toggleExpand(map.name)}
                        role="button"
                        aria-expanded={expandedMaps.includes(map.name)}
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            toggleExpand(map.name);
                          }
                        }}
                      >
                        <div>
                          <h4 className="font-semibold text-zinc-100 text-lg">
                            {map.name}
                          </h4>
                          <p className="text-xs text-zinc-400">
                            Tier {map.tier || "N/A"} - {map.type || "N/A"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
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
                            className="mt-4 space-y-4 overflow-hidden"
                          >
                            {map.status !== "Not Started" ? (
                              <>
                                {Object.entries(mapRecords[map.name] || {}).map(
                                  ([styleName, records]) => (
                                    <div
                                      key={styleName}
                                      className="pl-4 border-l-4 border-zinc-500"
                                    >
                                      <p className="text-xs font-semibold text-emerald-400 flex items-center mb-2">
                                        <Zap className="w-3 h-3 mr-1" />
                                        {styleName}
                                      </p>
                                      {records.length > 0 ? (
                                        records.map(
                                          (
                                            record: UserRecord,
                                            index: number
                                          ) => (
                                            <div key={index} className="mb-4">
                                              <p className="text-xs mb-1">
                                                <span className="text-zinc-400 font-semibold">
                                                  {record.isBonus
                                                    ? formatBonusName(
                                                        record.mapName,
                                                        map.name
                                                      )
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
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
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
                                  )
                                )}
                                {map.status === "In Progress" && (
                                  <div className="pl-4 border-l-4 border-zinc-500">
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
                                              (
                                                recordArray: UserRecord[]
                                              ) =>
                                                recordArray.some(
                                                  (record) =>
                                                    record.isBonus &&
                                                    formatBonusName(
                                                      record.mapName,
                                                      map.name
                                                    ) ===
                                                      formattedBonusName
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
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


// Reusable Status Card Component with React.memo for performance
const StatusCard: React.FC<{
  message: string;
  icon: React.ReactElement;
  title: string;
  color: string;
}> = React.memo(({ message, icon, title, color }) => (
  <Card className="bg-zinc-950 border-zinc-800 shadow-lg w-full">
    <CardHeader>
      <CardTitle className="text-white flex items-center text-lg md:text-xl">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className={`text-center ${color}`}>{message}</p>
    </CardContent>
  </Card>
));

// Reusable Stat Item Component with React.memo for performance
const StatItem: React.FC<{
  label: string;
  completed: number;
  total: number;
  color: string;
}> = React.memo(({ label, completed, total, color }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center bg-zinc-700/50 rounded-lg p-6">
      <span className="text-sm text-zinc-400 mb-2">{label}</span>
      <div className="flex items-baseline space-x-2">
        <span className={`text-3xl font-bold ${color}`}>{completed}</span>
        <span className="text-sm text-zinc-400">/ {total}</span>
      </div>
      <Progress value={percentage} className="w-full h-2 mt-3 rounded" />
    </div>
  );
});

// UserRecordsControls Component
interface UserRecordsControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  allTiers: string[];
}

const UserRecordsControls: React.FC<UserRecordsControlsProps> = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  filters,
  setFilters,
  allTiers,
}) => {
  // Type Guards to ensure type safety
  const isMapType = (value: string): value is MapType => {
    return allMapTypes.includes(value as MapType);
  };

  const isCompletionStatus = (value: string): value is CompletionStatus => {
    return allCompletionStatuses.includes(value as CompletionStatus);
  };

  // Stable and working perfectly.
  const handleTierChange = (selectedTiers: string[]) => {
    setFilters((prevFilters) => {
      if (selectedTiers.includes("All")) {
        // If "All" is selected and a tier is clicked, deselect "All" and select "All" if no other tiers are selected
        const newTiers = selectedTiers.filter(tier => tier !== "All" && !prevFilters.tiers.includes(tier));
        return { ...prevFilters, tiers: newTiers.length === 0 ? ["All"] : newTiers };
      } else if (prevFilters.tiers.includes("All")) {
        // If "All" was previously selected and a tier is clicked, select that tier and deselect "All"
        return { ...prevFilters, tiers: selectedTiers };
      } else if (selectedTiers.length === allTiers.length) {
        // If all individual tiers are selected, automatically select "All"
        return { ...prevFilters, tiers: ["All"] };
      } else if (selectedTiers.length === 0) {
        // Prevent having no selection by defaulting to ["All"]
        return { ...prevFilters, tiers: ["All"] };
      } else {
        // Set to the selected individual tiers
        return { ...prevFilters, tiers: selectedTiers };
      }
    });
  };

// Handler for Map Type Change
const handleMapTypeChange = (selectedMapTypes: string[]) => {
  setFilters((prevFilters) => {
    if (selectedMapTypes.includes("All")) {
      if (selectedMapTypes.length > 1) {
        // If "All" is selected and a map type is clicked and "All" came before the map type, deselect "All" and select the map type
        const allIndex = selectedMapTypes.indexOf("All");
        const otherIndex = selectedMapTypes.findIndex((type) => type !== "All");
        if (allIndex < otherIndex) {
          const validMapTypes = selectedMapTypes.filter(isMapType).filter((type) => type !== "All");
          return { ...prevFilters, mapType: validMapTypes };
        } else {
          // If a map type is selected and then "All" is clicked, deselect the map type(s) and select "All"
          return { ...prevFilters, mapType: ["All"] };
        }
      } else {
        // If only "All" is selected, set mapType to ["All"]
        return { ...prevFilters, mapType: ["All"] };
      }
    } else {
      if (selectedMapTypes.length === allMapTypes.length - 1) {
        // If all individual map types are selected, automatically select "All"
        return { ...prevFilters, mapType: ["All"] };
      } else if (selectedMapTypes.length === 0) {
        // Prevent having no selection by defaulting to ["All"]
        return { ...prevFilters, mapType: ["All"] };
      } else {
        // Validate and set to the selected individual map types
        const validMapTypes = selectedMapTypes.filter(isMapType);
        return { ...prevFilters, mapType: validMapTypes };
      }
    }
  });
};

// Handler for Completion Status Change
const handleCompletionStatusChange = (selectedStatuses: string[]) => {
  setFilters((prevFilters) => {
    if (selectedStatuses.includes("All")) {
      if (selectedStatuses.length > 1) {
        // If "All" is selected and a completion status is clicked and "All" came before the completion status, deselect "All" and select the completion status
        const allIndex = selectedStatuses.indexOf("All");
        const otherIndex = selectedStatuses.findIndex((status) => status !== "All");
        if (allIndex < otherIndex) {
          const validStatuses = selectedStatuses.filter(isCompletionStatus).filter((status) => status !== "All");
          return { ...prevFilters, completionStatus: validStatuses };
        } else {
          // If a completion status is selected and then "All" is clicked, deselect the completion status(es) and select "All"
          return { ...prevFilters, completionStatus: ["All"] };
        }
      } else {
        // If only "All" is selected, set completionStatus to ["All"]
        return { ...prevFilters, completionStatus: ["All"] };
      }
    } else {
      if (selectedStatuses.length === allCompletionStatuses.length - 1) {
        // If all individual statuses are selected, automatically select "All"
        return { ...prevFilters, completionStatus: ["All"] };
      } else if (selectedStatuses.length === 0) {
        // Prevent having no selection by defaulting to ["All"]
        return { ...prevFilters, completionStatus: ["All"] };
      } else {
        // Validate and set to the selected individual statuses
        const validStatuses = selectedStatuses.filter(isCompletionStatus);
        return { ...prevFilters, completionStatus: validStatuses };
      }
    }
  });
};

  return (
    <div className="flex flex-wrap items-center space-x-2">
      {/* Quick Search */}
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search maps..."
          className="bg-zinc-700 text-zinc-100 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors"
          aria-label="Search maps"
        />
      </div>

      {/* Filter and Sort within Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors"
            aria-label="Filter and Sort options"
          >
            <Filter className="w-6 h-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 bg-zinc-800 border border-zinc-700 p-4 rounded-lg shadow-xl"
          side="bottom"
          align="end"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div>
              <h3 className="text-lg font-semibold mb-4 text-zinc-100">
                Filters & Sort
              </h3>
              <div className="space-y-4">
                {/* Map Type Filter */}
                <div>
                  <span className="block text-xs text-zinc-300 mb-1">
                    Map Type
                  </span>
                  <ToggleGroup
                    type="multiple"
                    value={filters.mapType}
                    onValueChange={handleMapTypeChange}
                    className="flex flex-wrap gap-2"
                  >
                    {/* "All" Toggle */}
                    <ToggleGroupItem
                      value="All"
                      aria-label="All Map Types"
                      className={`
                        px-3 py-1 rounded-lg text-sm
                        bg-transparent text-zinc-300
                        transition-colors
                        data-[state=on]:bg-zinc-950 data-[state=on]:text-white
                        hover:bg-white hover:text-zinc-950
                        focus:outline-none
                        ${filters.mapType.includes("All") ? "cursor-default" : "cursor-pointer"}
                      `}
                      disabled={filters.mapType.includes("All")}
                    >
                      All
                    </ToggleGroupItem>

                    {/* Individual Map Type Toggles */}
                    {allMapTypes
                      .filter((type) => type !== "All")
                      .map((type) => {
                        const isOnlyOptionSelected =
                          filters.mapType.includes(type) && filters.mapType.length === 1;
                        return (
                          <ToggleGroupItem
                            key={type}
                            value={type}
                            aria-label={`Map Type ${type}`}
                            className={`
                              px-3 py-1 rounded-lg text-sm
                              bg-transparent text-zinc-300
                              transition-colors
                              data-[state=on]:bg-zinc-950 data-[state=on]:text-white
                              hover:bg-white hover:text-zinc-950
                              focus:outline-none
                              ${isOnlyOptionSelected ? "cursor-default" : "cursor-pointer"}
                            `}
                            disabled={isOnlyOptionSelected}
                          >
                            {type}
                          </ToggleGroupItem>
                        );
                      })}
                  </ToggleGroup>
                </div>

                {/* Tier Filter with Toggle Group */}
                <div>
                  <span className="block text-xs text-zinc-300 mb-1">Tier</span>
                  <ToggleGroup
                    type="multiple"
                    value={filters.tiers}
                    onValueChange={handleTierChange}
                    className="flex flex-wrap gap-2"
                  >
                    {/* "All" Toggle */}
                    <ToggleGroupItem
                      value="All"
                      aria-label="All Tiers"
                      className={`
                        px-3 py-1 rounded-lg text-sm
                        bg-transparent text-zinc-300
                        transition-colors
                        data-[state=on]:bg-zinc-950 data-[state=on]:text-white
                        hover:bg-white hover:text-zinc-950
                        focus:outline-none
                        ${filters.tiers.includes("All") ? "cursor-default" : "cursor-pointer"}
                      `}
                      disabled={filters.tiers.includes("All")}
                    >
                      All
                    </ToggleGroupItem>

                    {/* Individual Tier Toggles */}
                    {allTiers.map((tier) => {
                      const isOnlyTierSelected =
                        filters.tiers.includes(tier) && filters.tiers.length === 1;
                      return (
                        <ToggleGroupItem
                          key={tier}
                          value={tier}
                          aria-label={`Tier ${tier}`}
                          className={`
                            px-3 py-1 rounded-lg text-sm
                            bg-transparent text-zinc-300
                            transition-colors
                            data-[state=on]:bg-zinc-950 data-[state=on]:text-white
                            hover:bg-white hover:text-zinc-950
                            focus:outline-none
                            ${isOnlyTierSelected ? "cursor-default" : "cursor-pointer"}
                          `}
                          disabled={isOnlyTierSelected}
                        >
                          Tier {tier}
                        </ToggleGroupItem>
                      );
                    })}
                  </ToggleGroup>
                </div>

                {/* Completion Status Filter */}
                <div>
                  <span className="block text-xs text-zinc-300 mb-1">
                    Completion Status
                  </span>
                  <ToggleGroup
                    type="multiple"
                    value={filters.completionStatus}
                    onValueChange={handleCompletionStatusChange}
                    className="flex flex-wrap gap-2"
                  >
                    {/* "All" Toggle */}
                    <ToggleGroupItem
                      value="All"
                      aria-label="All Completion Statuses"
                      className={`
                        px-3 py-1 rounded-lg text-sm
                        bg-transparent text-zinc-300
                        transition-colors
                        data-[state=on]:bg-zinc-950 data-[state=on]:text-white
                        hover:bg-white hover:text-zinc-950
                        focus:outline-none
                        ${filters.completionStatus.includes("All") ? "cursor-default" : "cursor-pointer"}
                      `}
                      disabled={filters.completionStatus.includes("All")}
                    >
                      All
                    </ToggleGroupItem>

                    {/* Individual Completion Status Toggles */}
                    {allCompletionStatuses
                      .filter((status) => status !== "All")
                      .map((status) => {
                        const isOnlyStatusSelected =
                          filters.completionStatus.includes(status) &&
                          filters.completionStatus.length === 1;
                        return (
                          <ToggleGroupItem
                            key={status}
                            value={status}
                            aria-label={`Completion Status ${status}`}
                            className={`
                              px-3 py-1 rounded-lg text-sm
                              bg-transparent text-zinc-300
                              transition-colors
                              data-[state=on]:bg-zinc-950 data-[state=on]:text-white
                              hover:bg-white hover:text-zinc-950
                              focus:outline-none
                              ${isOnlyStatusSelected ? "cursor-default" : "cursor-pointer"}
                            `}
                            disabled={isOnlyStatusSelected}
                          >
                            {status}
                          </ToggleGroupItem>
                        );
                      })}
                  </ToggleGroup>
                </div>

                {/* Sort By Options */}
                <div>
                  <span className="block text-xs text-zinc-300 mb-1">
                    Sort By
                  </span>
                  <div className="flex flex-col gap-2">
                    {["Default", "Last Finished"].map((sortOption) => (
                      <Button
                        key={sortOption}
                        variant={sortBy === sortOption ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSortBy(sortOption as SortBy)}
                        className={`w-full text-left text-zinc-300 ${
                          sortBy === sortOption
                            ? "cursor-default"
                            : "hover:text-zinc-950 hover:bg-white"
                        }`}
                        disabled={sortBy === sortOption}
                      >
                        {sortOption}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserStatsCard;