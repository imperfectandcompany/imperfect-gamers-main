import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@components/ui/dialog";
import LoginView from "@components/Auth/LoginView";
import SignupView from "@components/Auth/SignupView";
import SetUsernameView from "@components/Auth/SetUsernameView";
import WelcomeView from "@components/Auth/WelcomeView";
import { useAuth } from "@context/AuthContext";
import { Alert, AlertDescription } from "../ui/alert";
import { ArrowLeft } from "lucide-react";

// Type for managing different views
type View = "welcome" | "signup" | "login" | "setUsername";

const AuthModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  contextMessage?: string;
}> = ({ isOpen, onClose, contextMessage }) => {
  const { isLoggedIn, user, login, logout } = useAuth();

  const [currentView, setCurrentView] = useState<View>("welcome");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoingForward, setIsGoingForward] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    // If logged in and onboarding not completed, navigate to username setup view
    if (isLoggedIn && user && !user.hasCompletedOnboarding) {
      setCurrentView("setUsername");
    } else if (isLoggedIn) {
      onClose();
    }
  }, [isLoggedIn, user, onClose]);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (currentView === "signup") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Signup submitted", { email, password });
        setView("login", true);
        setPassword("");
      } else if (currentView === "login") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Login submitted", { email, password });
        login({ email, hasCompletedOnboarding: false, avatarUrl: "" });
      } else if (currentView === "setUsername") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Username set", { username });
        login({ userName: username, hasCompletedOnboarding: true });
        alert("Onboarding complete! Welcome to Imperfect Gamers!");
        onClose();
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setView = (newView: View, goingForward: boolean) => {
    setIsGoingForward(goingForward);
    setCurrentView(newView);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && currentView !== "setUsername") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, currentView]);

  const getTitle = () => {
    switch (currentView) {
      case "welcome":
        return "Imperfect Gamers";
      case "signup":
        return "Sign Up";
      case "login":
        return "Lock In";
      case "setUsername":
        return "Almost there!";
      default:
        return "Imperfect Gamers";
    }
  };

  const getDescription = () => {
    switch (currentView) {
      case "welcome":
        return "Who's joining?";
      case "signup":
        return "Get Started";   
      case "login":
        return "Welcome back";
      case "setUsername":
        return "Pick a unique username";
      default:
        return "Imperfect Gamers";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 text-white text-center focus:outline-none transition duration-200 border-zinc-800 overflow-hidden">
        <div className="flex flex-col h-[600px]">
          <DialogHeader className={`flex flex-row items-baseline transition pb-4 justify-${currentView === 'welcome' ? 'center' : 'between'} border-b border-zinc-800`}>
            <div>
              {currentView !== "welcome" && (
                <div
                  className="flex items-center p-0 hover:cursor-pointer focus:cursor-auto text-white/40 transition duration hover:no-underline hover:opacity-40"
                  onClick={() => {
                    if (currentView === "setUsername") {
                      logout();
                      setView("login", false);
                    } else {
                      setView("welcome", false);
                    }
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  {currentView === "setUsername" ? "Logout" : "Back"}
                </div>
              )}
            </div>
            <div>
              <DialogTitle className="text-md font-medium flex-grow text-center">
                {getTitle()}
              </DialogTitle>

            </div>
            {currentView !== "welcome" && <div className="w-16" />}
            {/* {currentView !== "welcome" && <div className="w-24" />} */}
          </DialogHeader>
          <div
            className={`flex-grow overflow-y-auto ${
              isAnimating ? "overflow-x-hidden" : "overflow-x-auto"
            } p-4`}
          >
                          <DialogDescription className="text-center text-2xl font-bold my-8 text-white">
                {getDescription()}
              </DialogDescription>
            {contextMessage && (
              <Alert
                variant="destructive"
                className="mb-4 text-sm border border-red-500 bg-red-950/50 text-red-200"
              >
                <AlertDescription>{contextMessage}</AlertDescription>
              </Alert>
            )}
            <AnimatePresence
              mode="wait"
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: isGoingForward ? 100 : -100 }}
                onAnimationStart={() => setIsAnimating(true)}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isGoingForward ? -100 : 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {currentView === "welcome" && (
                  <WelcomeView
                    onSignup={() => setView("signup", true)}
                    onLogin={() => setView("login", true)}
                  />
                )}
                {currentView === "signup" && (
                  <SignupView
                    onBack={() => setView("welcome", false)}
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
                {currentView === "login" && (
                  <LoginView
                    onBack={() => setView("welcome", false)}
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
                {currentView === "setUsername" && (
                  <SetUsernameView
                    onLogout={() => {
                      logout();
                      setView("login", false);
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

          <footer className="text-center pt-4 text-sm text-red-500 border-t border-zinc-800">
            Powered by Imperfect and Company LLC ☂️
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
