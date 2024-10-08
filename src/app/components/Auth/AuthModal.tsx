import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle } from '@components/ui/dialog';
import LoginView from '@components/Auth/LoginView';
import SignupView from '@components/Auth/SignupView';
import SetUsernameView from '@components/Auth/SetUsernameView';
import WelcomeView from '@components/Auth/WelcomeView';
import { useAuth } from '@context/AuthContext';

// Type for managing different views
type View = 'welcome' | 'signup' | 'login' | 'setUsername';

const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { isLoggedIn, user, login, logout, completeOnboarding } = useAuth();

  const [currentView, setCurrentView] = useState<View>('welcome');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // If logged in and onboarding not completed, navigate to username setup view
    if (isLoggedIn && user && !user.hasCompletedOnboarding) {
      setCurrentView('setUsername');
    } else if (isLoggedIn) {
      onClose();
    }
  }, [isLoggedIn, user, onClose]);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (currentView === 'signup') {
        // Simulating API call for signup
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Signup submitted', { email, password });

        // After signup, direct the user to the login view to verify credentials
        setView('login');
        setPassword('');

      } else if (currentView === 'login') {
        // Simulating API call for login
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Login submitted', { email, password });

        login({ userName: email, avatarUrl: '', hasCompletedOnboarding: false });
        setPassword('');

      } else if (currentView === 'setUsername') {
        // Simulating API call for setting username
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Username set', { username });

        completeOnboarding();
        alert('Onboarding complete! Welcome to Imperfect Gamers!');
        onClose();
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setView = (newView: View) => {
    setCurrentView(newView);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && currentView !== 'setUsername') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, currentView]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle>Authentication</DialogTitle>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-800 overflow-hidden p-0">
        <div className="relative" style={{ height: '400px' }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute w-full h-full p-6"
            >
              {currentView === 'welcome' && (
                <WelcomeView onSignup={() => setView('signup')} onLogin={() => setView('login')} />
              )}
              {currentView === 'signup' && (
                <SignupView
                  onBack={() => setView('welcome')}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setPassword={setPassword}
                  isLoading={isLoading}
                />
              )}
              {currentView === 'login' && (
                <LoginView
                  onBack={() => setView('welcome')}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setPassword={setPassword}
                  isLoading={isLoading}
                />
              )}
              {currentView === 'setUsername' && (
                <SetUsernameView
                  onLogout={() => {
                    logout();
                    setView('login');
                  }}
                  onSubmit={(username) => {
                    setUsername(username);
                    handleSubmit();
                  }}
                  isLoading={isLoading}
                  username={username}
                  setUsername={setUsername}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <footer className="mt-8 text-center p-6 bg-zinc-900">
          <p className="text-red-500">Powered by Imperfect and Company LLC ☂️</p>
        </footer>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
