import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import TransactionsTab from "@/app/components/Settings/tabs/TransactionsTab";
import { Button } from "@components/ui/button";
import { TabButton } from "../Settings/reusable";
import { AccountTab, SecurityTab, AffiliatesTab, OptionsTab } from "@/app/components/Settings/tabs";

const SettingsPageContent: React.FC<{
  selectedTab: string;
  isSteamLinked: boolean;
  steamId: string;
  // linkSteam: () => void;
  linkSteam: (steamId: string) => void;
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

export default SettingsPageContent;