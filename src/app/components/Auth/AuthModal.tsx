// components/AuthModal.tsx

import React, { useEffect, useState } from "react";
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
import { useToast } from "@hooks/use-toast";
import { useFeatureFlags } from "@context/FeatureFlagContext";
import { FeatureFlagKeys } from "@utils/featureFlags";

const AuthModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  contextMessage?: string;
}> = ({ isOpen, onClose, contextMessage }) => {
  const {
    isLoggedIn,
    user,
    login,
    register,
    logout,
    currentView,
    setCurrentView,
  } = useAuth();

  const { toast } = useToast();
  const { isFeatureEnabled } = useFeatureFlags();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoingForward, setIsGoingForward] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [errorMessage, setLocalErrorMessage] = useState<string>("");

  useEffect(() => {
    // If logged in and onboarding not completed, navigate to username setup view
    if (isLoggedIn && user && !user.hasCompletedOnboarding) {
      if (isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_SETUSERNAME_VIEW)) {
        setCurrentView("setUsername");
      }
    }
  }, [isLoggedIn, user, setCurrentView, isFeatureEnabled]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setLocalErrorMessage("");

    try {
      if (currentView === "signup") {
        if (!isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_SIGNUP_VIEW)) {
          throw new Error("Signup feature is disabled.");
        }
        await register(email, password);
        // Show toast notification if enabled
        if (isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_TOASTS)) {
          toast({
            title: "Registration Successful",
            description: "Your account has been created. Please log in.",
          });
        }
        // After showing the toast, redirect to login view
        setCurrentView("login");
        setPassword(""); // Clear password
      } else if (currentView === "login") {
        if (!isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_LOGIN_VIEW)) {
          throw new Error("Login feature is disabled.");
        }
        const updatedUser = await login(email, password);

        // Clear password after login
        setPassword("");

        // If the user has completed onboarding, show a toast
        if (updatedUser?.hasCompletedOnboarding) {
          if (isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_TOASTS)) {
            toast({
              title: "Logged in successfully",
              description: `Welcome back, ${updatedUser.profile?.username || "user"}!`,
            });
          }
          onClose();
        } else if (updatedUser && !updatedUser.hasCompletedOnboarding) {
          if (isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_SETUSERNAME_VIEW)) {
            setCurrentView("setUsername");
          }
        }
      }
    } catch (error: any) {
      console.error("Error during form submission:", error);
      setLocalErrorMessage(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    onClose();
    setLocalErrorMessage("");
    setEmail("");
    setPassword("");
    if (isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_WELCOME_VIEW)) {
      setCurrentView("welcome");
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case "welcome":
        return "Sink.gg";
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

  // If the AuthModal feature flag is disabled, don't render the modal
  if (!isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL)) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleModalClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 text-white text-center focus:outline-none transition duration-200 border-zinc-800 overflow-hidden">
        <div className="flex flex-col h-[600px]">
          <DialogHeader
            className={`flex flex-row items-baseline transition pb-4 justify-${
              currentView === "welcome" ? "center" : "between"
            } border-b border-zinc-800`}
          >
            <div>
              {currentView !== "welcome" && isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_BACK_BUTTON) && (
                <div
                  className="flex items-center p-0 hover:cursor-pointer focus:cursor-auto text-white/40 transition duration hover:no-underline hover:opacity-40"
                  onClick={() => {
                    setLocalErrorMessage(""); // Clear the error message when clicking "Logout" or "Back"

                    if (currentView === "setUsername") {
                      logout();
                      setEmail("");
                      setPassword("");
                      setCurrentView("login");
                    } else if (
                      currentView === "login" ||
                      currentView === "signup"
                    ) {
                      setEmail("");
                      setPassword("");
                      setCurrentView("welcome");
                    } else {
                      setCurrentView("welcome");
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
            {currentView !== "welcome" && isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_BACK_BUTTON) && <div className="w-16" />}
          </DialogHeader>
          <div
            className={`flex-grow overflow-y-auto ${
              isAnimating ? "overflow-x-hidden" : "overflow-x-auto"
            } p-4`}
          >
            <DialogDescription className="text-center text-2xl font-bold my-8 text-white">
              {getDescription()}
            </DialogDescription>
            {contextMessage && isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_CONTEXT_MESSAGE) && (
              <Alert
                variant="destructive"
                className="mb-4 text-sm border border-red-500 bg-red-950/50 text-red-200"
              >
                <AlertDescription>{contextMessage}</AlertDescription>
              </Alert>
            )}
            {errorMessage && isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_ERROR_MESSAGES) && (
              <Alert
                variant="destructive"
                className="mb-4 text-sm border border-red-500 bg-red-950/50 text-red-200"
              >
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <AnimatePresence
              mode="wait"
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                key={currentView}
                initial={{
                  opacity: 0,
                  x: isGoingForward
                    ? isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_ANIMATIONS)
                      ? 100
                      : 0
                    : isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_ANIMATIONS)
                    ? -100
                    : 0,
                }}
                onAnimationStart={() => setIsAnimating(true)}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: isGoingForward
                    ? isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_ANIMATIONS)
                      ? -100
                      : 0
                    : isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_ANIMATIONS)
                    ? 100
                    : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                {currentView === "welcome" && isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_WELCOME_VIEW) && (
                  <WelcomeView
                    onSignup={() => {
                      setIsGoingForward(true);
                      setCurrentView("signup");
                    }}
                    onLogin={() => {
                      setIsGoingForward(true);
                      setCurrentView("login");
                    }}
                  />
                )}
                {currentView === "signup" && isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_SIGNUP_VIEW) && (
                  <SignupView
                    onBack={() => {
                      setIsGoingForward(false);
                      setCurrentView("welcome");
                    }}
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
                {currentView === "login" && isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_LOGIN_VIEW) && (
                  <LoginView
                    onBack={() => {
                      setIsGoingForward(false);
                      setCurrentView("welcome");
                    }}
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
                {currentView === "setUsername" && isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_SETUSERNAME_VIEW) && (
                  <SetUsernameView
                    onLogout={() => {
                      logout();
                      setEmail("");
                      setPassword("");
                      setCurrentView("login");
                    }}
                    isLoading={isLoading}
                    onSuccess={(newUsername) => {
                      onClose();
                      if (isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_TOASTS)) {
                        toast({
                          title: "Onboarding Complete",
                          description: `Welcome, ${newUsername}!`,
                        });
                      }
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {isFeatureEnabled(FeatureFlagKeys.ENABLE_AUTH_MODAL_FOOTER) && (
            <footer className="text-center pt-4 text-sm text-red-500 border-t border-zinc-800">
              Powered by Clydent.com☂️
            </footer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
