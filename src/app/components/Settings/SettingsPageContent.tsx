import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import TransactionsTab from "@/app/components/Settings/tabs/TransactionsTab";
import { Button } from "@components/ui/button";
import { FeatureNotAvailable, TabButton } from "../Settings/reusable";
import { AccountTab, SecurityTab, AffiliatesTab, OptionsTab } from "@/app/components/Settings/tabs";
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import { FeatureFlagKeys } from "@/app/utils/featureFlags";

const SettingsPageContent: React.FC<{
  selectedTab: string;
  isSteamLinked: boolean;
  steamId: string;
  unlinkSteam: () => Promise<void>;
}> = ({ unlinkSteam, steamId, isSteamLinked, selectedTab }) => {
  const [activeTab, setActiveTab] = useState(selectedTab || "ACCOUNT");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { flags, isFeatureEnabled } = useFeatureFlags();

  // Conditional rendering based on ENABLE_SETTINGS
  if (!isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS)) {
    return <FeatureNotAvailable title="Womp womp." description="Settings are currently disabled." />;
  }

  // Define available tabs based on feature flags using isFeatureEnabled
  const allTabs = useMemo(() => [
    { key: 'ACCOUNT', label: 'Account', enabled: isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_ACCOUNT) },
    { key: 'SECURITY', label: 'Security', enabled: isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_SECURITY) },
    { key: 'AFFILIATES', label: 'Affiliates', enabled: isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_AFFILIATES) },
    { key: 'OPTIONS', label: 'Options', enabled: isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_OPTIONS) },
    { key: 'TRANSACTIONS', label: 'Transactions', enabled: isFeatureEnabled(FeatureFlagKeys.ENABLE_SETTINGS_TRANSACTIONS) },
  ], [isFeatureEnabled]);

  const availableTabs = useMemo(() => allTabs.filter(tab => tab.enabled), [allTabs]);

  // Debugging Logs
  useEffect(() => {
    console.log('Feature Flags:', flags);
    console.log('Available Tabs:', availableTabs);
  }, [availableTabs]);

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
                {availableTabs.map((tab) => (
                  <TabButton
                    key={tab.key}
                    tab={tab.key}
                    activeTab={activeTab}
                    onClick={(tabKey) => {
                      setActiveTab(tabKey);
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
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-tr from-zinc-950 to-black/95 text-gray-300 font-sans">
      <motion.header
        className="from-zinc-900/5 bg-gradient-to-l to-zinc-950 p-4 flex items-center justify-between z-10"
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
            className="w-64 k from-zinc-900/5 to-zinc-950 bg-gradient-to-t  p-4 overflow-y-auto"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {availableTabs.map((tab, index) => (
              <motion.div
                key={tab.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TabButton
                  tab={tab.key}
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

export default SettingsPageContent;