// pages/index.tsx

import Head from 'next/head';
import { GetServerSideProps } from 'next';

interface Server {
  id: number;
  name: string;
  players: string;
  maxPlayers: string;
}

interface HomeProps {
  servers: Server[];
}

const Home: React.FC<HomeProps> = ({ servers }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Imperfect Gamers - Home</title>
        <meta name="description" content="Imperfect Gamers - The ultimate gaming community." />
      </Head>

      <header className="p-5 text-center bg-gray-800 shadow-lg">
        <h1 className="text-4xl font-bold">Welcome to Imperfect Gamers</h1>
        <p className="mt-2 text-lg">Your ultimate gaming experience starts here!</p>
      </header>

      <section className="flex items-center justify-center h-96 bg-cover bg-center"
        style={{ backgroundImage: `url('/images/hero-background.jpg')` }}>
        <div className="text-center">
          <h2 className="text-5xl font-bold">Join the Best Game Servers</h2>
          <p className="mt-4 text-xl">Play, chat, and compete with thousands of players worldwide.</p>
          <button className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-md">Get Started</button>
        </div>
      </section>

      <main className="p-10">
        <h2 className="text-3xl font-semibold">Our Servers</h2>
        <p className="mt-4">Explore our range of top-tier game servers and start your adventure.</p>
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map(server => (
            <div key={server.id} className="bg-gray-800 p-5 rounded-md shadow-lg">
              <h3 className="text-xl font-bold">{server.name}</h3>
              <p className="mt-2">Current Players: {server.players}/{server.maxPlayers}</p>
              <button className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md">Join Now</button>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-5 text-center bg-gray-800 mt-10">
        <p>&copy; 2024 Imperfect Gamers. All rights reserved.</p>
      </footer>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Example fetching data (replace with your MySQL query)
  const servers = [
    { id: 1, name: 'CS:GO Surf', players: '54', maxPlayers: '64' },
    { id: 2, name: 'Minecraft Survival', players: '120', maxPlayers: '150' },
    { id: 3, name: 'GTA V Roleplay', players: '32', maxPlayers: '64' },
  ];

  return { props: { servers } };
};

export default Home;
