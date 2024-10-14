import { motion } from "framer-motion";

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

  export default TabButton;