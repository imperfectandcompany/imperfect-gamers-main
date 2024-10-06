'use client'

import React from 'react';
import Head from 'next/head';
import MainNavbar from './components/Navbar/MainNavbar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-start bg-zinc-950 text-white">
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

<MainNavbar/>

      {/* Navigation */}
      <nav>
        <ul className="flex flex-col md:flex-row justify-around items-center bg-[#1a1a1a]">
          <li className="flex-1 flex justify-center items-center py-4 cursor-pointer hover:bg-[#5c6165]">
            <i className="fa fa-home"></i>
          </li>
          <li className="flex-1 flex justify-center items-center py-4 border-t-2 md:border-l-2 md:border-t-0 border-[#23282e] hover:bg-[#5c6165] cursor-pointer">
            SURF
          </li>
          <li className="flex-1 flex justify-center items-center py-4 border-t-2 md:border-l-2 md:border-t-0 border-[#23282e] hover:bg-[#5c6165] cursor-pointer">
            MAPS
          </li>
          <li className="flex-1 flex justify-center items-center py-4 border-t-2 md:border-l-2 md:border-t-0 border-[#23282e] hover:bg-[#5c6165] cursor-pointer">
            STATS
          </li>
          <li className="flex-1 flex justify-center items-center py-4 border-t-2 md:border-l-2 md:border-t-0 border-[#23282e] hover:bg-[#5c6165] cursor-pointer">
            INFRACTIONS
          </li>
          <li className="flex-1 flex justify-center items-center py-4 border-t-2 md:border-l-2 md:border-t-0 border-[#23282e] hover:bg-[#5c6165] cursor-pointer">
            SETTINGS
          </li>
          <li className="flex-1 flex justify-center items-center py-4 hover:bg-[#5c6165] cursor-pointer">
            <i className="material-icons">power_settings_new</i>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col flex-1 justify-center items-center space-y-10 py-10">
        <div className="flex flex-col lg:flex-row justify-center mt-10 space-y-4 lg:space-y-0 lg:space-x-10">
          <div className="bg-[#111111] border-2 border-[#222222] shadow-lg p-4 rounded-lg w-full lg:w-80 h-[175px] flex flex-col justify-between">
            <div className="flex items-center">
              <img
                className="w-16 h-16 border-2 border-[#333333] rounded"
                src="https://placehold.co/60x60"
                alt="Avatar of Steam user"
              />
              <div className="ml-4">
                <p className="text-lg">SteamName</p>
                <button className="view-profile-btn px-3 py-2 bg-[#333333] text-white text-xs rounded mt-2">
                  View Profile
                </button>
              </div>
            </div>
            <div className="player__matches bg-[#222222] p-2 flex justify-between items-center rounded">
              <p className="ml-2">Surf Maps Completed</p>
              <p className="mr-4">42</p>
            </div>
          </div>

          <div className="bg-[#111111] border-2 border-[#222222] shadow-lg p-4 rounded-lg w-full lg:w-[600px] h-[175px]">
            <div className="text-white">
              Website Development
              <br />
              Our website is currently under development. Stay tuned for
              updates and new features!
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-center mt-10 space-y-4 lg:space-y-0 lg:space-x-10">
          <div className="bg-[#111111] border-2 border-[#222222] shadow-lg w-full lg:w-80 h-auto lg:h-[500px]">
            <div className="bg-[#222222] p-4 flex justify-between items-center">
              <p className="font-bold">Recent Players</p>
              <p className="text-[#bec1c7]">5 Players</p>
            </div>
            {[1, 2, 3, 4].map((player) => (
              <div
                key={player}
                className="flex items-center p-4 border-b-2 border-[#333333] last:border-b-0"
              >
                <img
                  src="https://placehold.co/46x46"
                  className="w-12 h-12 border-3 border-[#444444] bg-[#333333] rounded-full"
                  alt={`Avatar of Player${player}`}
                />
                <div className="ml-4">
                  <p className="text-[#bec1c7]">Player {player}</p>
                  <p className="text-[#bec1c7] text-sm">{player} hour{player > 1 ? "s" : ""} ago</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#111111] border-2 border-[#222222] shadow-lg w-full lg:w-[600px] h-auto lg:h-[500px]">
            <div className="bg-[#222222] p-4">
              <p className="font-bold">News</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="text-white">
                <strong>New Maps Added to Tier 1 Server</strong>
                <br />
                15 MAR 2024
                <br />
                <p className="mt-2">
                  We're excited to announce the addition of new maps to our
                  Tier 1 surf server! These maps are designed to provide a
                  challenging yet enjoyable experience for all skill levels...
                  <a href="#" className="text-[#4e9af1] ml-2">Read more</a>
                </p>
              </div>

              <div className="text-white">
                <strong>VIP Membership Launching Soon!</strong>
                <br />
                30 MAY 2024
                <br />
                <p className="mt-2">
                  We’re thrilled with your enthusiasm for our upcoming VIP
                  membership. We're finalizing the details with our partners at
                  Tebex to ensure everything meets compliance standards...
                  <a href="#" className="text-[#4e9af1] ml-2">Read more</a>
                </p>
              </div>

              <div className="text-white">
                <strong>Bonus Replays Now Available!</strong>
                <br />
                10 JUN 2024
                <br />
                <p className="mt-2">
                  Thanks to recent updates, you can now watch bonus replays on
                  our servers. This means new times will have to be set to view
                  the bonuses. To check what bonuses have replays use the
                  command: !btop...
                  <a href="#" className="text-[#4e9af1] ml-2">Read more</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer mt-auto bg-[#1a1a1a] py-16">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between gap-12 text-white">
          <div className="flex flex-col space-y-4" style={{ background: "none", boxShadow: "none", alignItems: "flex-start" }}>
            <h1 className="text-xl">Imperfect Gamers</h1>
            <p>
              Made with <span style={{ color: "#ff4757" }}>❤</span> by Imperfect and Company LLC
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="w-10 h-10 bg-[#333333] flex justify-center items-center rounded">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-[#333333] flex justify-center items-center rounded">
                <i className="fab fa-steam"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-[#333333] flex justify-center items-center rounded">
                <i className="fab fa-discord"></i>
              </a>
            </div>
            <p className="footer-text text-[#888888] mt-4">2024 © All Rights Reserved</p>
          </div>

          {/* Links Section 1 */}
          <div className="flex flex-col space-y-2">
            <ul className="space-y-2">
              <li className="text-[#cccccc]">About Us</li>
              <li className="text-[#cccccc]">Our Mission</li>
              <li className="text-[#cccccc]">Privacy Policy</li>
              <li className="text-[#cccccc]">Terms of Service</li>
            </ul>
          </div>

          {/* Links Section 2 */}
          <div className="flex flex-col space-y-2">
            <ul className="space-y-2">
              <li className="text-[#cccccc]">Support</li>
              <li className="text-[#cccccc]">FAQ</li>
              <li className="text-[#cccccc]">Join Our Team</li>
              <li className="text-[#cccccc]">Contact Us</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
