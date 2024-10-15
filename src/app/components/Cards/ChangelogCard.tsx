import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { PlusCircle } from "lucide-react";
import { useFeatureFlags } from "@context/FeatureFlagContext";
import { FeatureFlagKeys } from "@utils/featureFlags";

interface Reaction {
  emoji: string;
  count: number;
}

interface Changelog {
  version: string;
  date: string;
  changes: string[];
  reactions: Reaction[];
}

interface ChangelogCardProps {
  changelog: Changelog[];
  onReact: (index: number, reactionIndex: number, emoji: string) => void;
  reactionEmojis: string[];
}

// components/ChangelogCard.tsx

const ChangelogCard: React.FC<ChangelogCardProps> = ({
  changelog,
  onReact,
  reactionEmojis,
}) => {
  const { isFeatureEnabled } = useFeatureFlags();

  // If the ChangelogCard feature flag is disabled, don't render the card
  if (!isFeatureEnabled(FeatureFlagKeys.ENABLE_CHANGELOG_CARD)) {
    return null;
  }

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-white">Changelog</CardTitle>
        {isFeatureEnabled(FeatureFlagKeys.ENABLE_CHANGELOG_VIEW_ALL) && (
          <Button variant="link" className="text-red-400">
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {changelog.map((versionItem, index) => (
            <div
              key={index}
              className="border-b border-zinc-800 pb-4 last:border-b-0 last:pb-0"
            >
              <h4 className="text-lg font-semibold text-white">
                Version {versionItem.version} - {versionItem.date}
              </h4>
              <ul className="list-disc list-inside mt-2 text-zinc-300">
                {versionItem.changes.map((change, changeIndex) => (
                  <li key={changeIndex}>{change}</li>
                ))}
              </ul>
              {isFeatureEnabled(FeatureFlagKeys.ENABLE_CHANGELOG_REACTIONS) && (
                <div className="flex space-x-2 mt-2">
                  {versionItem.reactions.map((reaction, reactionIndex) => (
                    <Button
                      key={reactionIndex}
                      variant="outline"
                      size="sm"
                      className="bg-zinc-800 hover:bg-zinc-700 text-white border-none"
                      onClick={() =>
                        onReact(index, reactionIndex, reaction.emoji)
                      }
                    >
                      {reaction.emoji} {reaction.count}
                    </Button>
                  ))}
                  {isFeatureEnabled(
                    FeatureFlagKeys.ENABLE_CHANGELOG_REACTIONS_POPOVER
                  ) && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-zinc-800 hover:bg-zinc-700 text-white border-none"
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-zinc-800 border-none">
                        <div className="grid grid-cols-5 gap-2">
                          {reactionEmojis.map((emoji, emojiIndex) => (
                            <Button
                              key={emojiIndex}
                              variant="ghost"
                              size="sm"
                              className="text-2xl"
                              onClick={() => onReact(index, -1, emoji)}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangelogCard;
