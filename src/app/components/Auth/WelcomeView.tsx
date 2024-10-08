import React from 'react';
import { Button } from '@components/ui/button';

interface WelcomeViewProps {
  onSignup: () => void;
  onLogin: () => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onSignup, onLogin }) => {
  return (
    <div className="flex flex-col h-full">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Imperfect Gamers</h1>
        <h2 className="text-4xl font-extrabold">Who's joining?</h2>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 gap-6 w-full">
          <Button
            onClick={onSignup}
            className="h-32 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center text-left p-6"
          >
            <div className="text-xl font-bold mb-2">Unranked</div>
            <div className="text-2xl font-extrabold">Join Now!</div>
          </Button>
          <Button
            onClick={onLogin}
            className="h-32 bg-orange-600 hover:bg-orange-700 flex flex-col items-center justify-center text-left p-6"
          >
            <div className="text-xl font-bold mb-2">Veteran</div>
            <div className="text-2xl font-extrabold">Welcome Back!</div>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default WelcomeView;