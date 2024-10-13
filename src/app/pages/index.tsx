// Home.tsx

import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@context/AuthContext';
import LoadingSpinner from '@components/LoadingSpinner';
import MainPage from './MainPage';
import { AnimatePresence } from 'framer-motion';

const HomeContent = () => {
  const { isVerifying, setIsVerifying } = useAuth();
  
  const [fidelity, setFidelity] = useState(0)

  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsVerifying(false), 5000)
    return () => clearTimeout(loadingTimer)
  }, [])

  useEffect(() => {
    if (!isVerifying) {
      const fidelityTimer = setInterval(() => {
        setFidelity(prev => {
          if (prev >= 100) {
            clearInterval(fidelityTimer)
            return 100
          }
          return prev + 1
        })
      }, 20)
      return () => clearInterval(fidelityTimer)
    }
  }, [isVerifying])

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner key="loading" />
      </div>
    );
  }

  return <MainPage key="main" fidelity={fidelity} />;
};

export default function Home() {
  return (
    <AuthProvider>
            <AnimatePresence>
      <HomeContent />
      </AnimatePresence>
    </AuthProvider>
  );
}
