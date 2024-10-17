import React from "react";
import { Dialog, DialogContent } from "@components/ui/dialog";
import SettingsPageContent from "./SettingsPageContent";

const SettingsDialog: React.FC<{
  isOpen: boolean;
  steamId: string;
  isSteamLinked: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedTab: string;
  // linkSteam: () => void;
  unlinkSteam: () => Promise<void>;
}> = ({
  isOpen,
  onOpenChange,
  selectedTab,
  unlinkSteam,
  isSteamLinked,
  steamId,
}) => {
  return (
    <div className="flex items-center justify-center">
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="flex flex-col max-w-[80vw] md:max-w-[55vw] md:w-[1200px] max-h-[80vh] p-0 focus:outline-none transition duration-200 border-zinc-800 overflow-hidden">
          <SettingsPageContent
            selectedTab={selectedTab}
            unlinkSteam={unlinkSteam}
            isSteamLinked={isSteamLinked}
            steamId={steamId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsDialog;