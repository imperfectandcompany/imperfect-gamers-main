import React, { useState } from 'react';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { LogOut, Loader2 } from 'lucide-react';

interface SetUsernameViewProps {
  onLogout: () => void;
  onSubmit: (username: string) => void;
  isLoading: boolean;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

const SetUsernameView: React.FC<SetUsernameViewProps> = ({ onLogout, onSubmit, isLoading, username, setUsername }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username);
  };

  return (
    <div className="flex flex-col h-full">
      <nav className="flex justify-between items-center mb-8">
      <Button variant="ghost" className="text-white p-0" onClick={onLogout}>
          <LogOut className="h-6 w-6 mr-2" />
          Logout
        </Button>
      </nav>

      <main className="flex-grow flex flex-col justify-center w-full">
        <h2 className="text-3xl font-bold mb-2">Almost there!</h2>
        <p className="text-zinc-400 mb-8">Pick a unique username to represent you in the Imperfect Gamers.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="sr-only">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Finish Onboarding'
            )}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default SetUsernameView;