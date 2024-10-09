import React from 'react';
import { Input } from '@components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@components/ui/dropdown-menu';
import { Button } from '@components/ui/button';
import { Bell, Search, LogIn, Check, User } from 'lucide-react';
import { useAuth } from '@context/AuthContext';

interface HeaderProps {
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean | undefined;
  onOpenAuthModal: (message?: string) => void; // Make message optional
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, hasCompletedOnboarding, onOpenAuthModal }) => {
  const { user, logout } = useAuth();

  const handleLoginClick = () => {
    onOpenAuthModal(); // Provide a default login context
  };

  const handleVerifyClick = () => {
    onOpenAuthModal();
  };

  const handleLogout = () => {
    logout();
  };

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
              hasCompletedOnboarding ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center text-white"
                      aria-label="Account Options"
                    >
                      <User className="h-5 w-5 mr-2 text-zinc-400" />
                      {user?.userName}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => console.log('View Profile')}>View Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center text-white"
                  onClick={handleVerifyClick}
                  aria-label="Verify Account"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Verify
                </Button>
              )
            ) : (
              <Button
                variant="default"
                size="sm"
                className="flex items-center text-white"
                onClick={handleLoginClick}
                aria-label="Log In"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Log In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;