import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/imperfectandcompany/SharpTimer/main/remote_data/rank_icons/**'
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/imperfectandcompany/Imperfect-SharpTimer/dev/remote_data/rank_icons/**'
      }
    ]
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src/app'),
      '@components': path.resolve(__dirname, './src/app/components'),
      '@pages': path.resolve(__dirname, './src/app/pages'),
      '@styles': path.resolve(__dirname, './src/app/styles'),
      '@utils': path.resolve(__dirname, './src/app/lib/utils'),
      '@hooks': path.resolve(__dirname, './src/app/hooks'),
      '@lib': path.resolve(__dirname, './src/app/lib'),
      "@api": path.resolve(__dirname, './src/app/api'),
      '@context': path.resolve(__dirname, './src/app/context'),
    };
    return config;
  },
};

export default nextConfig;
