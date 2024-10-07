import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
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
      '@context': path.resolve(__dirname, './src/app/context'),
    };
    return config;
  },
};

export default nextConfig;
