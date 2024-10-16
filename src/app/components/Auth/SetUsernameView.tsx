// SetUsernameView.tsx

import React, { useState } from 'react';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { useAuth } from '@context/AuthContext';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@components/ui/alert';

interface SetUsernameViewProps {
  onLogout: () => void;
  isLoading: boolean;
  onSuccess: (newUsername: string) => void;
}

const SetUsernameView: React.FC<SetUsernameViewProps> = ({ onLogout, isLoading, onSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const { changeUsername, checkUsernameExistence } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const exists = await checkUsernameExistence(username);
      if (exists) {
        setErrorMessage('Username is already taken.');
      } else {
        await changeUsername(username);
        onSuccess(username); // Pass the new username
      }
    } catch (error: any) {
      console.error('Error setting username:', error);
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <main className="flex-grow flex flex-col justify-center w-full">
        {errorMessage && (
          <Alert
            variant="destructive"
            className="mb-4 text-sm border border-red-500 bg-red-950/50 text-red-200"
          >
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
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
              disabled={loading}
              className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={loading}
          >
            {loading ? (
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
