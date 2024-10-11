/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { dev, isServer }) => {
      if (!dev && !isServer) {
        config.devtool = false;
      }
      config.resolve.fallback = { fs: false, net: false, tls: false };
      return config;
    },
  };

export default nextConfig;