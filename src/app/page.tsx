// Page.tsx

"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { AuthProvider, useAuth } from "@context/AuthContext";
import { MainPage } from "./pages/MainPage";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "@components/ui/sonner";
import { FeatureFlagProvider } from "./context/FeatureFlagContext";
import { Toast } from "@radix-ui/react-toast";

const HomeContent = () => {
  const { isVerifying } = useAuth();

  const [fidelity, setFidelity] = useState(0);

  const shouldApplyBlur = isVerifying;

  useEffect(() => {
    if (isVerifying) {
      setFidelity(0);
    } else {
      const fidelityTimer = setInterval(() => {
        setFidelity((prev) => {
          if (prev >= 100) {
            clearInterval(fidelityTimer);
            return 100;
          }
          return prev + 1;
        });
      }, 1);
      return () => clearInterval(fidelityTimer);
    }
  }, [isVerifying]);

  return (
    <>
      {isVerifying ? (
        <LoadingSpinner key="loading" />
      ) : (
        <MainPage
          key="main"
          fidelity={fidelity}
          shouldApplyBlur={shouldApplyBlur}
        />
      )}
    </>
  );
};

export default function Home() {
  return (
    <FeatureFlagProvider>
      <AuthProvider>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            border: 'none',
          },
          duration: 3000,
          closeButton: true,
        }}
        className="toaster-with-custom-close-button"
      />
        <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col justify-start">
          <Head>
            <title>Underground Entertainment - Imperfect Gamers</title>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
            />
            <link
              href="https://fonts.googleapis.com/icon?family=Material+Icons"
              rel="stylesheet"
            />
            <style>{`
            body {
              background-color: #0d0d0d;
              background-image: linear-gradient(to bottom, rgba(34,34,34,1) 0%, rgba(0,0,0,1) 100%), url('https://placehold.co/1920x1080');
              background-repeat: no-repeat;
              background-position: center;
              background-size: cover;
              color: #ffffff;
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              min-height: 100vh;
            }
          `}</style>
          </Head>

          {/* Navigation */}

          <HomeContent />
        </div>
      </AuthProvider>
    </FeatureFlagProvider>
  );
}
