// LoadingSpinner.tsx

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

const LoadingSpinner: React.FC = () => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress(oldProgress => {
          if (oldProgress >= 100) {
            clearInterval(timer)
            return 100
          }
          return oldProgress + 1
        })
      }, 5)
  
      return () => clearInterval(timer)
    }, [])
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-screen bg-[#121212]"
      >
            <div className="flex items-center justify-center h-full p-8">
      <svg
        className="animate-spin h-10 w-10 text-red-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      </div>
        <div className="text-2xl font-bold mb-4 text-white">Imperfect Gamers</div>
        <div className="w-64 h-2 bg-gray-700 rounded-full mb-4">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-400">Loading surf map...</div>
      </motion.div>
    )
  }
export default LoadingSpinner;
