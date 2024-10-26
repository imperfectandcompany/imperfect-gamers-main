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
} from "lucide-react";
import { GameStats, UserRecord, styleMapping } from "../../interfaces/server2";
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

import { mapsAndBonuses, MapData } from "../../data/mapsAndBonuses"; // Import the maps and bonuses data

// Define types for filtering
type MapType = "Staged" | "Linear" | "All";
type StyleType = string | "All";
type CompletionStatus = "Completed" | "Not Completed" | "All";

interface UserStatsProps {
  isLoggedIn: boolean;
  isSteamLinked: boolean;
  hasServerData: boolean;
  hasCompletedOnboarding: boolean;
  gameStats: GameStats | null;
}

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
    style: "All" as StyleType,
    completionStatus: "All" as CompletionStatus,
  });

  // Handle map expansion/collapse
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
            {/* Failed to load your stats. Please try again later. */}
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
            {/* Failed to load your stats. Please try again later. */}
            No server data found for your Steam account. Play on our server to generate stats.
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

  const { globalPoints, timesConnected, lastConnected, mapRecords } =
    gameStats;

  // Use accurate totals from mapsAndBonuses data
  const totalMaps = mapsAndBonuses.totalMaps;
  const totalBonuses = mapsAndBonuses.totalBonuses;

  // Initialize sets to keep track of completed maps and bonuses
  const completedMapsSet = new Set<string>();
  const completedBonusesSet = new Set<string>();

  // Calculate completed maps and bonuses
  Object.entries(mapRecords).forEach(([mapName, styles]) => {
    Object.values(styles).forEach((records) => {
      records.forEach((record) => {
        if (record.isBonus) {
          // Identify bonuses by parentMapName and mapName
          if (record.parentMapName) {
            completedBonusesSet.add(
              `${record.parentMapName}:${record.mapName}`
            );
          } else {
            completedBonusesSet.add(record.mapName);
          }
        } else {
          // Base map
          completedMapsSet.add(mapName);
        }
      });
    });
  });

  const mapsCompleted = completedMapsSet.size;
  const bonusesCompleted = completedBonusesSet.size;

  const totalCompletions = mapsCompleted + bonusesCompleted;

  // Compute overall completion percentage
  const overallCompletionPercentage =
    (totalCompletions / (totalMaps + totalBonuses)) * 100;

  // Helper function to format Unix timestamp
  const formatTimestamp = (unixStamp: number) => {
    return formatDistanceToNow(new Date(unixStamp * 1000), { addSuffix: true });
  };

  // Prepare a list of all maps with completion status
  const allMapsWithCompletionStatus = mapsAndBonuses.maps.map((map) => {
    const isCompleted = completedMapsSet.has(map.name);
    return {
      ...map,
      isCompleted,
    };
  });

  // Prepare filtered maps
  let displayedMaps: MapData[] = [];

  // Filter maps based on filters
  displayedMaps = allMapsWithCompletionStatus.filter((map) => {
    const mapTypeMatch =
      filters.mapType === "All" ||
      (filters.mapType === "Staged" && map.isStaged) ||
      (filters.mapType === "Linear" && !map.isStaged);

    const completionMatch =
      filters.completionStatus === "All" ||
      (filters.completionStatus === "Completed" && map.isCompleted) ||
      (filters.completionStatus === "Not Completed" && !map.isCompleted);

    return mapTypeMatch && completionMatch;
  });

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
          <div className="bg-zinc-900 p-4 rounded-lg">
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
                    className="h-2"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total Completions: {totalCompletions}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Completion Stats */}
          <div className="grid grid-cols-2 gap-4">
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
            <div className="flex flex-col items-center justify-center bg-zinc-900 rounded-lg p-2">
              <span className="text-xs text-zinc-400">Total Completions</span>
              <span className="text-xl font-bold text-red-400">
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-400 flex items-center">
                <Trophy className="w-6 h-6 mr-2" />
                User Records
              </h2>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Filter className="w-6 h-6 text-zinc-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-zinc-800 border border-zinc-700 p-4 rounded-lg shadow-xl">
                  <h3 className="text-lg font-semibold mb-2 text-zinc-100">
                    Filters
                  </h3>
                  <div className="space-y-2">
                    {/* Map Type Filter */}
                    <div>
                      <label className="block text-zinc-300 mb-1">Map Type</label>
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
                        <option value="Staged">Staged</option>
                        <option value="Linear">Linear</option>
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
                            completionStatus:
                              e.target.value as CompletionStatus,
                          })
                        }
                        className="w-full bg-zinc-700 text-zinc-100 p-2 rounded"
                      >
                        <option value="All">All</option>
                        <option value="Completed">Completed</option>
                        <option value="Not Completed">Not Completed</option>
                      </select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <ScrollArea className="h-64">
              <div className="space-y-4 pr-4">
                {displayedMaps.map((map:any) => (
                  <motion.div
                    key={map.name}
                    className={`bg-gradient-to-br from-zinc-700 to-zinc-600 rounded-lg p-4 text-sm shadow-md border border-zinc-500 relative ${
                      !map.isCompleted ? "opacity-50" : ""
                    }`}
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleExpand(map.name)}
                    >
                      <h4 className="font-semibold text-zinc-100">{map.name}</h4>
                      {!map.isCompleted && (
                        <span className="text-xs text-red-500">
                          Not Completed
                        </span>
                      )}
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
                    <AnimatePresence>
                      {expandedMaps.includes(map.name) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 space-y-3 overflow-hidden"
                        >
                          {map.isCompleted ? (
                            Object.entries(mapRecords[map.name]).map(
                              ([styleName, records]) => (
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
                                              {record.mapName}:
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
                                          {record.stageTimes && (
                                            <div className="grid grid-cols-3 gap-1 mt-1">
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
                            )
                          ) : (
                            <div className="text-xs text-zinc-400">
                              <p>You haven't completed this map yet.</p>
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

function TourStatItem({
  label,
  completed,
  total,
}: {
  label: string;
  completed: number;
  total: number;
}) {
  const percentage = (completed / total) * 100;

  return (
    <div className="flex flex-col items-center justify-center bg-zinc-900 rounded-lg p-2">
      <span className="text-xs text-zinc-400">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold text-zinc-100">{completed}</span>
        <span className="text-xs text-zinc-400">/ {total}</span>
      </div>
      <Progress value={percentage} className="w-full h-1 mt-1" />
    </div>
  );
}

export default UserStatsCard;
