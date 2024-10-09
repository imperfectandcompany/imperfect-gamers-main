'use client'

import React, { useState } from 'react';
import Head from 'next/head';
import MainNavbar from './components/Navbar/MainNavbar';
import HomeTest from './pages';
import MainPage from './pages/MainPage';
import { AuthProvider } from './context/AuthContext';

export default function Home() {

  return (
    <AuthProvider>
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

      <MainPage/>
    </div>
    </AuthProvider>
  );
}
