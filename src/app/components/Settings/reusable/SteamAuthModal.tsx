// components/SteamAuthModal.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@context/AuthContext";
import { generateSteamLoginURL } from "@lib/steamAuth";
import { Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { useFeatureFlags } from "@context/FeatureFlagContext";
import { FeatureFlagKeys } from "@utils/featureFlags";
import { showToast } from "@/app/utils/toastUtils";

const SteamAuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { setUser } = useAuth();
  const [showTrouble, setShowTrouble] = useState(false);
  const [authStatus, setAuthStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [windowClosed, setWindowClosed] = useState(false);
  const steamWindowRef = useRef<Window | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const { isFeatureEnabled } = useFeatureFlags();
  // todo dont remove toast instance until user leaves modal even if its not in pending (loading) and says something like authentication window was closed etc.

  useEffect(() => {
    let messageListener: (event: MessageEvent) => void;
    let checkWindowClosedInterval: NodeJS.Timeout | null = null;
    let loadingToastId: string | number | undefined = undefined;

    if (isOpen) {
      setAuthStatus("loading");
      const timer = setTimeout(() => setShowTrouble(true), 5000);
      loadingToastId = showToast({
        type: "loading",
        message: "Launching Steam authentication...",
        duration: 3000,
      });

      launchSteamAuthWindow();

      messageListener = async (event: MessageEvent) => {
        // Check if the message event's origin matches the current window's origin.
        // If not, exit the function to prevent handling messages from untrusted sources.
        if (event.origin !== window.location.origin) return;

        if (event.data.type === "steam-auth-success") {
          const steamId = event.data.steamId;
          // Proceed with linking the Steam ID
          await handleSteamAuthSuccess(steamId, loadingToastId!);
        } else if (event.data.type === "steam-auth-error") {
          console.error("Steam authentication error:", event.data.error);
          if (
            isFeatureEnabled(
              FeatureFlagKeys.ENABLE_STEAM_AUTH_MODAL_ERROR_MESSAGES
            )
          ) {
            // showToast({
            //   type: "error",
            //   message:
            //     event.data.error ||
            //     "An error occurred during Steam authentication.",
            // });
          }
          setAuthStatus("error");
          // Update the loading toast to error
          if (loadingToastId) {
            // showToast({
            //   type: "error",
            //   message:
            //     event.data.error ||
            //     "An error occurred during Steam authentication.",
            //   toastId: loadingToastId,
            // });
          }
        }
      };

      window.addEventListener("message", messageListener);

      checkWindowClosedInterval = setInterval(() => {
        if (steamWindowRef.current && steamWindowRef.current.closed) {
          clearInterval(checkWindowClosedInterval!);
          setWindowClosed(true);
          setAuthStatus("idle");
          // Update the loading toast to error if it exists
          if (loadingToastId) {
            showToast({
              type: "error",
              message: "Authentication window was closed before completion.",
              toastId: loadingToastId,
            });
          }
        }
      }, 500);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("message", messageListener);
        if (checkWindowClosedInterval) clearInterval(checkWindowClosedInterval);
      };
    } else {
      setShowTrouble(false);
      setAuthStatus("idle");
      setWindowClosed(false);
    }
  }, [isOpen, isFeatureEnabled]);

  const launchSteamAuthWindow = () => {
    const returnURL = `${window.location.origin}/auth/steam/callback`;
    const steamLoginURL = generateSteamLoginURL(returnURL);

    steamWindowRef.current = window.open(
      steamLoginURL,
      "SteamAuth",
      "width=800,height=600"
    );

    const checkWindowClosed = setInterval(() => {
      if (steamWindowRef.current && steamWindowRef.current.closed) {
        clearInterval(checkWindowClosed);
        setWindowClosed(true);
        setAuthStatus("idle");
      }
    }, 500);

    // Ensure to clear the interval when component unmounts
    return () => {
      clearInterval(checkWindowClosed);
    };
  };

  const handleSteamAuthSuccess = async (
    steamId: string,
    loadingToastId: string | number | undefined
  ) => {
    if (steamWindowRef.current) steamWindowRef.current.close();
    try {
      // Check if Steam ID is already linked to another user
      const checkResponse = await fetch(
        `https://api.imperfectgamers.org/user/checkSteamLinked/${steamId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );

      const checkData = await checkResponse.json();

      if (checkData.linked) {
        throw new Error(
          "This Steam account is already linked to another user."
        );
      }

      // Call API to link Steam account
      const response = await fetch(
        "https://api.imperfectgamers.org/user/linkSteam",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token") || "",
          },
          body: JSON.stringify({ steamId64: steamId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to link Steam account.");
      }

      // Update user state
      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              isSteamLinked: true,
              steamId: steamId,
            }
          : prevUser
      );

      setAuthStatus("success");

      if (isFeatureEnabled(FeatureFlagKeys.ENABLE_STEAM_AUTH_MODAL_TOASTS)) {
        // Update the existing loading toast to success
        showToast({
          type: "success",
          message: `Steam account linked successfully! Your Steam ID: ${steamId}`,
          toastId: loadingToastId,
        });
      }

      // Delay closing the modal to ensure the toast is visible
      setTimeout(() => {
        onClose();
      }, 500); // Adjust the delay as needed
    } catch (error: any) {
      console.error("Error linking Steam ID:", error);
      setAuthStatus("error");

      const errorMessage =
        error.message || "Failed to link Steam account. Please try again.";

        if (
          isFeatureEnabled(FeatureFlagKeys.ENABLE_STEAM_AUTH_MODAL_ERROR_MESSAGES)
        ) {
          // Update the existing loading toast to error
          showToast({
            type: "error",
            message: errorMessage,
            toastId: loadingToastId,
          });
        }
      }
    };

  const focusSteamWindow = () => {
    if (steamWindowRef.current && !steamWindowRef.current.closed) {
      steamWindowRef.current.focus();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && steamWindowRef.current && !steamWindowRef.current.closed) {
      focusSteamWindow();
      return;
    }
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (
      event.key === "Escape" &&
      steamWindowRef.current &&
      !steamWindowRef.current.closed
    ) {
      event.preventDefault();
      focusSteamWindow();
    }
  };

  const handleManualRedirect = () => {
    const returnURL = `${window.location.origin}/auth/steam/callback`;
    const steamLoginURL = generateSteamLoginURL(returnURL, "redirect");
    window.location.href = steamLoginURL;
  };

  // If the SteamAuthModal feature flag is disabled, don't render the modal
  if (!isFeatureEnabled(FeatureFlagKeys.ENABLE_STEAM_AUTH_MODAL)) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] bg-zinc-950 text-white border border-zinc-800 shadow-lg"
        ref={modalRef}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Link Steam
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-4">
          {authStatus === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-white" />
              <p className="text-center text-lg">
                {windowClosed
                  ? "Relaunching Steam authentication..."
                  : "Please link your Steam account in the popup window."}
              </p>
            </>
          )}
          {authStatus === "success" && (
            <p className="text-center text-lg text-green-500">
              Steam account linked successfully!
            </p>
          )}
          {windowClosed && authStatus !== "loading" && (
            <div className="text-center">
              <p className="text-lg mb-2">
                The authentication window was closed.
              </p>
              {isFeatureEnabled(
                FeatureFlagKeys.ENABLE_STEAM_AUTH_MODAL_RELAUNCH_BUTTON
              ) && (
                <Button
                  onClick={() => {
                    setWindowClosed(false);
                    setAuthStatus("loading");
                    launchSteamAuthWindow();
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white"
                >
                  Relaunch Steam Auth
                </Button>
              )}
            </div>
          )}
          {isFeatureEnabled(
            FeatureFlagKeys.ENABLE_STEAM_AUTH_MODAL_ANIMATIONS
          ) && (
            <motion.div
              className="w-full overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: showTrouble ? "auto" : 0 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence>
                {showTrouble && (
                  <motion.div
                    className="bg-zinc-900 p-4 text-sm rounded-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p>
                      Still having trouble? It's possible your browser blocked
                      the popup. No worries, you can{" "}
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="text-red-500 hover:underline focus:outline-none">
                            click here
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="bg-yellow-800/50 text-yellow-400 border-none mx-2 rounded-md"
                          align="center"
                          sideOffset={5}
                        >
                          This feature is coming soon.
                        </PopoverContent>
                      </Popover>{" "}
                      to try manually.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
          {!isFeatureEnabled(
            FeatureFlagKeys.ENABLE_STEAM_AUTH_MODAL_ANIMATIONS
          ) &&
            showTrouble && (
              <div className="bg-zinc-900 p-4 text-sm rounded-md">
                <p>
                  Still having trouble? It's possible your browser blocked the
                  popup. No worries, you can{" "}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-red-500 hover:underline focus:outline-none">
                        click here
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="bg-yellow-800/50 text-yellow-400 border-none mx-2 rounded-md"
                      align="center"
                      sideOffset={5}
                    >
                      This feature is coming soon.
                    </PopoverContent>
                  </Popover>{" "}
                  to try manually.
                </p>
              </div>
            )}
        </div>
        {isFeatureEnabled(FeatureFlagKeys.ENABLE_STEAM_AUTH_MODAL_FOOTER) && (
          <footer className="text-center pt-4 text-sm text-gray-500 border-t border-zinc-800">
            Powered by Clydent.com☂️
          </footer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SteamAuthModal;
