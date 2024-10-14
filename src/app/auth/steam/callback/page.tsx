// src/app/auth/steam/callback/page.tsx

"use client";

import { useEffect } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const SteamCallbackPage = () => {
  useEffect(() => {
    const processSteamResponse = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      // const query = Object.fromEntries(queryParams.entries()); // No longer needed

      try {
        const response = await fetch('/api/auth/steam/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: queryParams.toString() }),
        });

        const data = await response.json();

        if (data.success) {
          const steamId = data.steamId;
          if (window.opener) {
            window.opener.postMessage(
              { type: "steam-auth-success", steamId },
              window.location.origin
            );
            window.close();
          } else {
            // TODO: Handle the case where window.opener is null
            // For example, redirect to a page in our app
            window.location.href = `/settings?steamId=${steamId}`;
          }
        } else {
          if (window.opener) {
            window.opener.postMessage(
              { type: "steam-auth-error", error: data.error },
              window.location.origin
            );
            window.close();
          } else {
            // TODO: Handle the case where window.opener is null
            // Handle the error case when window.opener is null
            window.location.href = `/settings?error=${encodeURIComponent(data.error)}`;
          }
        }
      } catch (error) {
        console.error('Error verifying Steam assertion:', error);
        if (window.opener) {
          window.opener.postMessage(
            { type: "steam-auth-error", error: 'Verification failed' },
            window.location.origin
          );
          window.close();
        } else {
          // Handle the error case when window.opener is null
          window.location.href = `/settings?error=${encodeURIComponent('Verification failed')}`;
        }
      }
    };

    processSteamResponse();
  }, []);

  return <LoadingSpinner/>;
};


export default SteamCallbackPage;