const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Elimină sau comentează linia următoare:
  // output: 'export',
  reactStrictMode: true,
  // Comentați temporar orice alte configurări pentru a vedea dacă rezolvă problema
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
}

module.exports = nextConfig
