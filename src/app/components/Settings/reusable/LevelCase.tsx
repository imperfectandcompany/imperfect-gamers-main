import { motion } from "framer-motion";

const LevelCase: React.FC<{ tier: string }> = ({ tier }) => (
    <motion.div
      className="bg-[#2a2a2a] w-10 h-10 flex items-center justify-center rounded cursor-pointer"
      whileHover={{ scale: 1.1, backgroundColor: "#3a3a3a" }}
      whileTap={{ scale: 0.9 }}
    >
      <span className="text-xs font-bold text-[#c0c0c0]">{tier}</span>
    </motion.div>
  );

  export default LevelCase;