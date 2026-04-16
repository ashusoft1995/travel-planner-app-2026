/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  transpilePackages: ['framer-motion'],
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;