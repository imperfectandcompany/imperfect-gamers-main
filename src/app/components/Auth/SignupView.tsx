import React from 'react';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface SignupViewProps {
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const SignupView: React.FC<SignupViewProps> = ({ email, password, setEmail, setPassword, onBack, onSubmit, isLoading }) => {
  return (
    <div className="flex flex-col h-full">
      <main className="flex-grow flex flex-col justify-center w-full">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="sr-only">
              Email
            </Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="sr-only">
              Password
            </Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              'Create Account'
            )}
          </Button>
        </form>

        <p className="text-sm text-zinc-400 mt-4 text-center">
          You are accessing a beta version of the platform, which is still undergoing final testing before its official release.
        </p>
      </main>
    </div>
  );
};

export default SignupView;