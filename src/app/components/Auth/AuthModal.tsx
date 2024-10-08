import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@components/ui/dialog';
import LoginView from '@components/Auth/LoginView';
import SignupView from '@components/Auth/SignupView';
import SetUsernameView from '@components/Auth/SetUsernameView';
import WelcomeView from '@components/Auth/WelcomeView';

// Type for managing different views
type View = 'welcome' | 'signup' | 'login' | 'setUsername';

const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (currentView === 'signup') {
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Signup submitted', { email, password });
        setView('login');
        setPassword(''); // Clear password but keep email
      } else if (currentView === 'login') {
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Login submitted', { email, password });
        setView('setUsername');
        setPassword(''); // Clear password after login
      } else if (currentView === 'setUsername') {
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Username set', { username });
        alert('Onboarding complete! Welcome to Imperfect Gamers!');
        onClose();
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutAlert(true);
    setTimeout(() => {
      setShowLogoutAlert(false);
      setView('login');
      setEmail('');
      setPassword('');
      setUsername('');
    }, 2000);
  };

  const setView = (newView: View) => {
    setCurrentView(newView);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                  onLogout={handleLogout}
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