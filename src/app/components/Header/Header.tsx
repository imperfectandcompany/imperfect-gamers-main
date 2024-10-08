import React, { useState } from 'react';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Bell, Search, LogIn } from 'lucide-react';
import AuthModal from '@components/Auth/AuthModal';

interface HeaderProps {
  isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <header className="bg-zinc-950 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="https://cdn.imperfectgamers.org/inc/assets/img/logo.svg?height=40&width=40"
              alt="Imperfect Gamers Community Logo"
              className="h-10"
            />
            <span className="text-xl font-bold text-white">Imperfect Gamers</span>
          </div>
          <nav className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search players..."
                className="w-64 bg-zinc-900 border-zinc-700 pr-10 text-white"
                aria-label="Search players"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-zinc-400" />
              </Button>
            </div>
            {isLoggedIn ? (
              <Button variant="ghost" size="sm" className="flex items-center text-white">
                <Bell className="h-5 w-5 mr-2 text-zinc-400" />
                Notifications
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="flex items-center text-white"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Log In
              </Button>
            )}
          </nav>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};

export default Header;