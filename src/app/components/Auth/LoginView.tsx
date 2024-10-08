import React from 'react';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface LoginViewProps {
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}

const LoginView: React.FC<LoginViewProps> = ({ onBack, onSubmit, email, password, setEmail, setPassword, isLoading }) => {
  return (
    <div className="flex flex-col h-full">
      <nav className="flex justify-between items-center mb-8">
        <Button variant="ghost" className="text-white p-0" onClick={onBack}>
          <ArrowLeft className="h-6 w-6 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-semibold">Log In</h1>
        <div className="w-16" />
      </nav>

      <main className="flex-grow flex flex-col justify-center w-full">
        <h2 className="text-4xl font-bold mb-8">Yoo--yo. Welcome back.</h2>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              id="email"
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
            <Label htmlFor="password" className="sr-only">
              Password
            </Label>
            <Input
              id="password"
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
              'Log In'
            )}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default LoginView;